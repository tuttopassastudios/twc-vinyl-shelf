import { create } from 'zustand'
import CATALOG from '../utils/catalog'

const useCollectionStore = create((set, get) => ({
  albums: CATALOG,
  albumDetails: {},

  cacheAlbumDetails: (albumId, details) => {
    set({ albumDetails: { ...get().albumDetails, [albumId]: details } })
  },

  getAlbumDetails: (albumId) => {
    return get().albumDetails[albumId] || null
  },
}))

export default useCollectionStore
