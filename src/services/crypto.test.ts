import { describe, it, expect } from 'vitest';
import { encryptData, decryptData } from './crypto';

describe('Crypto Service', () => {
  const passphrase = 'test-password';
  const data = 'This is a secret message.';

  it('should encrypt and then decrypt data successfully', async () => {
    const { encrypted, salt, iv } = await encryptData(passphrase, data);

    expect(encrypted).toBeDefined();
    expect(salt).toBeDefined();
    expect(iv).toBeDefined();

    const decryptedData = await decryptData(passphrase, encrypted, salt, iv);

    expect(decryptedData).toBe(data);
  });

  it('should fail to decrypt with the wrong passphrase', async () => {
    const { encrypted, salt, iv } = await encryptData(passphrase, data);
    const wrongPassphrase = 'wrong-password';

    await expect(decryptData(wrongPassphrase, encrypted, salt, iv)).rejects.toThrow();
  });

  it('should produce different encrypted output for the same data (due to random salt/iv)', async () => {
    const result1 = await encryptData(passphrase, data);
    const result2 = await encryptData(passphrase, data);

    expect(result1.encrypted).not.toBe(result2.encrypted);
    expect(result1.salt).not.toBe(result2.salt);
    expect(result1.iv).not.toBe(result2.iv);
  });
});
