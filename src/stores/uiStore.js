import { create } from 'zustand'

const useUiStore = create((set) => ({
  selectedAlbumId: null,
  isRecordPulledOut: false,
  showLinerNotes: false,
  showAbout: false,
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

  toggleAbout: () => set((s) => ({ showAbout: !s.showAbout })),
  setAbout: (show) => set({ showAbout: show }),

  setAnimating: (animating) => set({ isAnimating: animating }),
}))

export default useUiStore
