export const useAuth = () => {
    const token = useState<string | null>('token', () => null)
    const user = useState<any | null>('user', () => null)
  
    /**
     * Called after login
     */
    const setAuth = (jwt: string) => {
      token.value = jwt
      localStorage.setItem('token', jwt)
  
      // 🚫 NEVER trust user from login response
      // Always fetch fresh user from /auth/me
    }
  
    /**
     * Load logged-in user from backend
     */
    const loadUser = async () => {
      const { $api } = useNuxtApp()
  
      const { data } = await $api.get('/auth/me')
  
      user.value = data
      localStorage.setItem('user', JSON.stringify(data))
    }
  
    /**
     * Logout everywhere
     */
    const logout = () => {
      token.value = null
      user.value = null
  
      localStorage.removeItem('token')
      localStorage.removeItem('user')
  
      navigateTo('/')
    }
  
    /**
     * Initialize auth on app load (client-only)
     */
    const init = async () => {
      if (!process.client) return
  
      const t = localStorage.getItem('token')
  
      if (!t) return
  
      token.value = t
  
      try {
        // ✅ ALWAYS refresh user
        await loadUser()
      } catch {
        logout()
      }
    }
  
    return {
      token,
      user,
      setAuth,
      loadUser,
      init,
      logout,
    }
  }
  