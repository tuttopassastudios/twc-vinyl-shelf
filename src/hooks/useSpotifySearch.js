import { useState, useEffect, useRef } from 'react'
import { searchAlbums } from '../services/spotifyApi'
import useAuthStore from '../stores/authStore'

export default function useSpotifySearch(query, delay = 300) {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const accessToken = useAuthStore((s) => s.accessToken)
  const timeoutRef = useRef(null)

  useEffect(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    if (!query || query.trim().length < 2 || !accessToken) {
      setResults([])
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    timeoutRef.current = setTimeout(async () => {
      try {
        const albums = await searchAlbums(query.trim(), accessToken)
        setResults(albums)
      } catch (err) {
        setError(err.message)
        setResults([])
      } finally {
        setLoading(false)
      }
    }, delay)

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [query, accessToken, delay])

  return { results, loading, error }
}
