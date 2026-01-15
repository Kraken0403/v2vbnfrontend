export default defineNuxtRouteMiddleware(async () => {
    // 🚫 Do nothing during SSR
    if (process.server) return
  
    const token = localStorage.getItem('token')
  
    if (!token) {
      return navigateTo('/')
    }
  
    // Optional but recommended: validate token once
    try {
      const { $api } = useNuxtApp()
      await $api.get('/auth/me')
    } catch {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      return navigateTo('/')
    }
  })
  