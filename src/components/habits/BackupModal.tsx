import { useRef, useState } from "react";
import { useUIStore } from "@/store/ui";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/common/Dialog";
import { Button } from "@/components/common/Button";
import { Input } from "@/components/common/Input";
import { exportDataAsJson, importDataFromJson, exportDataAsEncryptedJson, importDataFromEncryptedJson } from "@/services/backup";

export function BackupModal() {
  const { activeModal, closeModal } = useUIStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [passphrase, setPassphrase] = useState("");
  const isOpen = activeModal === 'backup';

  const handleExport = async () => {
    await exportDataAsJson();
    closeModal();
  };

  const handleEncryptedExport = async () => {
    if (!passphrase) {
      alert("Please enter a passphrase for encryption.");
      return;
    }
    await exportDataAsEncryptedJson(passphrase);
    closeModal();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const jsonString = e.target?.result as string;
      if (!jsonString) return;

      try {
        const data = JSON.parse(jsonString);
        if (data.encrypted && data.salt && data.iv) {
          // This looks like an encrypted file
          const importPassphrase = window.prompt("Enter the passphrase for this backup file:");
          if (importPassphrase) {
            await importDataFromEncryptedJson(jsonString, importPassphrase);
            closeModal();
          }
        } else {
          // This looks like a plain JSON file
          await importDataFromJson(jsonString);
          closeModal();
        }
      } catch (error) {
        console.error("Error processing backup file", error);
        alert("Could not import backup file. It may be corrupted or in an invalid format.");
      }
    };
    reader.readAsText(file);
    // Reset file input
    event.target.value = '';
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeModal()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Backup & Restore</DialogTitle>
          <DialogDescription>
            Export your data to a JSON file, or import a previously saved backup.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Import</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Import data from a JSON backup file. This will overwrite all current data.
            </p>
            <Button variant="outline" onClick={handleImportClick}>Import from File</Button>
            <input
              type="file"
              ref={fileInputRef}
              accept="application/json"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
          <div>
            <h3 className="font-semibold mb-2">Export</h3>
            <p className="text-sm text-muted-foreground mb-2">
              Save all your data to a JSON file. For security, you can encrypt it with a passphrase.
            </p>
            <div className="flex flex-col gap-2">
              <Button onClick={handleExport} className="w-full">Export Unencrypted</Button>
              <div className="flex gap-2 items-center p-2 border rounded-lg">
                <Input
                  type="password"
                  placeholder="Enter passphrase..."
                  value={passphrase}
                  onChange={(e) => setPassphrase(e.target.value)}
                  className="flex-1"
                />
                <Button onClick={handleEncryptedExport} disabled={!passphrase}>Export Encrypted</Button>
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
