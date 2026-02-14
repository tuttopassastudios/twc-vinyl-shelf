import { create } from 'zustand'

const usePlayerStore = create((set) => ({
  isPlaying: false,
  currentTrack: null,
  currentAlbumId: null,
  position: 0,
  duration: 0,
  volume: 0.5,
  deviceId: null,
  playerReady: false,
  isPremium: null, // null = unknown, true/false

  setPlaying: (isPlaying) => set({ isPlaying }),
  setCurrentTrack: (track, albumId) => set({ currentTrack: track, currentAlbumId: albumId }),
  setPosition: (position) => set({ position }),
  setDuration: (duration) => set({ duration }),
  setVolume: (volume) => set({ volume }),
  setDeviceId: (deviceId) => set({ deviceId }),
  setPlayerReady: (ready) => set({ playerReady: ready }),
  setIsPremium: (isPremium) => set({ isPremium }),

  reset: () =>
    set({
      isPlaying: false,
      currentTrack: null,
      currentAlbumId: null,
      position: 0,
      duration: 0,
      deviceId: null,
      playerReady: false,
    }),
}))

export default usePlayerStore
