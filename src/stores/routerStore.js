import { create } from 'zustand'

function parseHash() {
  const hash = window.location.hash || '#/'
  const path = hash.slice(1) || '/'

  if (path === '/') {
    return { view: 'shelf', albumId: null, personSlug: null }
  }

  const albumMatch = path.match(/^\/album\/(.+)$/)
  if (albumMatch) {
    return { view: 'album', albumId: albumMatch[1], personSlug: null }
  }

  const personMatch = path.match(/^\/person\/(.+)$/)
  if (personMatch) {
    return { view: 'person', albumId: null, personSlug: personMatch[1] }
  }

  return { view: 'shelf', albumId: null, personSlug: null }
}

const useRouterStore = create((set) => {
  // Initialize from current hash
  const initial = parseHash()

  // Listen for hash changes (back/forward)
  window.addEventListener('hashchange', () => {
    set(parseHash())
  })

  return {
    ...initial,

    navigate: (path) => {
      window.location.hash = path
      // hashchange listener will update state
    },
  }
})

export default useRouterStore
