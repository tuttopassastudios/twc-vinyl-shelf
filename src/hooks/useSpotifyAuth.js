import { useEffect, useCallback } from 'react'
import useAuthStore from '../stores/authStore'
import { handleCallback, refreshAccessToken, redirectToSpotifyAuth } from '../services/spotifyAuth'
import { getCurrentUser } from '../services/spotifyApi'
import { initPlayer, disconnectPlayer } from '../services/spotifyPlayer'

export default function useSpotifyAuth() {
  const { isAuthenticated, accessToken, refreshToken, setTokens, setUser, logout, isTokenExpired } =
    useAuthStore()

  // Handle OAuth callback
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')
    if (!code) return

    // Clean URL
    const base = import.meta.env.BASE_URL || '/'
    window.history.replaceState({}, '', base)

    handleCallback(code)
      .then((tokens) => {
        setTokens(tokens)
      })
      .catch((err) => {
        console.error('Auth callback failed:', err)
      })
  }, [setTokens])

  // Fetch user profile on auth
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return
    getCurrentUser(accessToken)
      .then(setUser)
      .catch(console.error)
  }, [isAuthenticated, accessToken, setUser])

  // Init Spotify player
  useEffect(() => {
    if (!isAuthenticated || !accessToken) return
    initPlayer().catch(console.error)
    return () => disconnectPlayer()
  }, [isAuthenticated, accessToken])

  // Auto-refresh tokens
  useEffect(() => {
    if (!isAuthenticated || !refreshToken) return
    const interval = setInterval(async () => {
      if (isTokenExpired()) {
        try {
          const tokens = await refreshAccessToken(refreshToken)
          setTokens(tokens)
        } catch {
          logout()
        }
      }
    }, 60000) // check every minute
    return () => clearInterval(interval)
  }, [isAuthenticated, refreshToken, isTokenExpired, setTokens, logout])

  const login = useCallback(() => {
    redirectToSpotifyAuth()
  }, [])

  return { isAuthenticated, login, logout, accessToken }
}
