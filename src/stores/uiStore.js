import { create } from 'zustand'

const useUiStore = create((set) => ({
  selectedAlbumId: null,
  isRecordPulledOut: false,
  showLinerNotes: false,
  isAnimating: false,

  selectRecord: (albumId) =>
    set({ selectedAlbumId: albumId, isRecordPulledOut: true }),

  deselectRecord: () =>
    set({
      selectedAlbumId: null,
      isRecordPulledOut: false,
      showLinerNotes: false,
    }),

  toggleLinerNotes: () =>
    set((s) => ({ showLinerNotes: !s.showLinerNotes })),

  setShowLinerNotes: (show) => set({ showLinerNotes: show }),

  setAnimating: (animating) => set({ isAnimating: animating }),
}))

export default useUiStore
