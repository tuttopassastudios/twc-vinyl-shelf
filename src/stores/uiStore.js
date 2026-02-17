import { create } from 'zustand'

const useUiStore = create((set) => ({
  showLinerNotes: false,
  isAnimating: false,

  toggleLinerNotes: () =>
    set((s) => ({ showLinerNotes: !s.showLinerNotes })),

  setShowLinerNotes: (show) => set({ showLinerNotes: show }),

  setAnimating: (animating) => set({ isAnimating: animating }),
}))

export default useUiStore
