import axios from 'axios'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const api = axios.create({
    baseURL: config.public.apiBase, // 👈 from runtimeConfig
    withCredentials: false,
  })

  api.interceptors.request.use(
    (request) => {
      // 🚨 SSR-safe localStorage access
      if (process.client) {
        const token = localStorage.getItem('token')
        if (token) {
          request.headers.Authorization = `Bearer ${token}`
        }
      }

      return request
    },
    (error) => Promise.reject(error),
  )

  return {
    provide: {
      api,
    },
  }
})
