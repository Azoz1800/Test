// Helper function to convert buffer to base64
function bufferToBase64(buffer: ArrayBuffer): string {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)));
}

// Helper function to convert base64 to buffer
function base64ToBuffer(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// Derives a key from a passphrase using PBKDF2
async function deriveKey(passphrase: string, salt: Uint8Array): Promise<CryptoKey> {
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(passphrase),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    true,
    ["encrypt", "decrypt"]
  );
}

// Encrypts data using AES-GCM
export async function encryptData(passphrase: string, data: string): Promise<{ encrypted: string; salt: string; iv: string }> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await deriveKey(passphrase, salt);

  const encodedData = new TextEncoder().encode(data);

  const encrypted = await crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: iv,
    },
    key,
    encodedData
  );

  return {
    encrypted: bufferToBase64(encrypted),
    salt: bufferToBase64(salt),
    iv: bufferToBase64(iv),
  };
}

// Decrypts data using AES-GCM
export async function decryptData(passphrase: string, encrypted: string, salt: string, iv: string): Promise<string> {
  const saltBuffer = base64ToBuffer(salt);
  const ivBuffer = base64ToBuffer(iv);
  const encryptedBuffer = base64ToBuffer(encrypted);

  const key = await deriveKey(passphrase, saltBuffer);

  const decrypted = await crypto.subtle.decrypt(
    {
      name: "AES-GCM",
      iv: ivBuffer,
    },
    key,
    encryptedBuffer
  );

  return new TextDecoder().decode(decrypted);
}
