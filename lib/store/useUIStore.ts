import { create } from "zustand";

export type CursorVariant = "default" | "hover" | "view" | "drag" | "hidden";

interface UIState {
  // Cursor state
  cursorVariant: CursorVariant;
  cursorText: string;
  setCursorVariant: (variant: CursorVariant) => void;
  setCursorText: (text: string) => void;
  resetCursor: () => void;

  // Navigation menu state
  isMenuOpen: boolean;
  toggleMenu: () => void;
  openMenu: () => void;
  closeMenu: () => void;

  // Video reel modal state
  isVideoModalOpen: boolean;
  openVideoModal: () => void;
  closeVideoModal: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  cursorVariant: "default",
  cursorText: "",
  setCursorVariant: (variant) => set({ cursorVariant: variant }),
  setCursorText: (text) => set({ cursorText: text }),
  resetCursor: () => set({ cursorVariant: "default", cursorText: "" }),

  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  openMenu: () => set({ isMenuOpen: true }),
  closeMenu: () => set({ isMenuOpen: false }),

  isVideoModalOpen: false,
  openVideoModal: () => set({ isVideoModalOpen: true }),
  closeVideoModal: () => set({ isVideoModalOpen: false }),
}));
