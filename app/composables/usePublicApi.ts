// app/composables/usePublicApi.ts
export const usePublicApi = () => {
    const config = useRuntimeConfig()
  
    return $fetch.create({
      baseURL: config.public.apiBase,
    })
  }
  