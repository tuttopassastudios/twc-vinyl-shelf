import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useCollectionStore = create(
  persist(
    (set, get) => ({
      albums: [],
      albumDetails: {}, // cached full album details keyed by id

      addAlbum: (album) => {
        const { albums } = get()
        if (albums.find((a) => a.id === album.id)) return
        set({ albums: [...albums, album] })
      },

      removeAlbum: (albumId) => {
        set({ albums: get().albums.filter((a) => a.id !== albumId) })
      },

      reorderAlbums: (newOrder) => {
        set({ albums: newOrder })
      },

      cacheAlbumDetails: (albumId, details) => {
        set({ albumDetails: { ...get().albumDetails, [albumId]: details } })
      },

      getAlbumDetails: (albumId) => {
        return get().albumDetails[albumId] || null
      },
    }),
    {
      name: 'twc-vinyl-collection',
    }
  )
)

export default useCollectionStore
