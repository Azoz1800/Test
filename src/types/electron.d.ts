export interface IElectronAPI {
  showNotification: (title: string, body: string) => void;
}

declare global {
  interface Window {
    electronAPI: IElectronAPI;
  }
}
