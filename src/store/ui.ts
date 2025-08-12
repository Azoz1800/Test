import { create } from 'zustand';

type ModalType = 'addHabit' | 'editHabit' | 'backup' | 'restore' | null;

interface UIState {
  isSidebarOpen: boolean;
  activeModal: ModalType;
  modalData: any; // Data to pass to the modal, e.g., the habit to edit
  toggleSidebar: () => void;
  openModal: (modal: ModalType, data?: any) => void;
  closeModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false,
  activeModal: null,
  modalData: null,
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  openModal: (modal, data = null) => set({ activeModal: modal, modalData: data }),
  closeModal: () => set({ activeModal: null, modalData: null }),
}));
