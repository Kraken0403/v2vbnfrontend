export default defineNuxtRouteMiddleware(() => {
    if (process.server) return
  
    const raw = localStorage.getItem('user')
    if (!raw) return navigateTo('/')
  
    const user = JSON.parse(raw)
  
    if (!['ADMIN', 'SUPER_ADMIN'].includes(user.role)) {
      return navigateTo('/dashboard')
    }
  })
  