import { create } from 'zustand'

const useAuthStore = create((set, get) => ({
  accessToken: sessionStorage.getItem('spotify_access_token') || null,
  refreshToken: sessionStorage.getItem('spotify_refresh_token') || null,
  expiresAt: Number(sessionStorage.getItem('spotify_expires_at')) || null,
  isAuthenticated: !!sessionStorage.getItem('spotify_access_token'),
  user: null,

  setTokens: ({ accessToken, refreshToken, expiresIn }) => {
    const expiresAt = Date.now() + expiresIn * 1000
    sessionStorage.setItem('spotify_access_token', accessToken)
    if (refreshToken) sessionStorage.setItem('spotify_refresh_token', refreshToken)
    sessionStorage.setItem('spotify_expires_at', String(expiresAt))
    set({
      accessToken,
      refreshToken: refreshToken || get().refreshToken,
      expiresAt,
      isAuthenticated: true,
    })
  },

  setUser: (user) => set({ user }),

  logout: () => {
    sessionStorage.removeItem('spotify_access_token')
    sessionStorage.removeItem('spotify_refresh_token')
    sessionStorage.removeItem('spotify_expires_at')
    set({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      isAuthenticated: false,
      user: null,
    })
  },

  isTokenExpired: () => {
    const { expiresAt } = get()
    if (!expiresAt) return true
    return Date.now() >= expiresAt - 60000 // 1 min buffer
  },
}))

export default useAuthStore
