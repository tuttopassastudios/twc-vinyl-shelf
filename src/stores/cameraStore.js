import { create } from 'zustand'

const useCameraStore = create((set) => ({
  fov: 50,
  distance: 6,
  height: 0.8,

  setFov: (fov) => set({ fov }),
  setDistance: (distance) => set({ distance }),
  setHeight: (height) => set({ height }),
}))

export default useCameraStore
