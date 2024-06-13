import { create } from "zustand";

interface AuthModalStore {
  isOpen: boolean;
  onToggleModal: () => void;
  onOpen: () => void;
}

export const useAuthModalStore = create<AuthModalStore>((set) => ({
  isOpen: false, // Initialize isOpen to false
  onToggleModal: () => set((state) => ({ isOpen: !state.isOpen })), // Toggle isOpen
  onOpen: () => set({ isOpen: true }), // Close modal
}));
