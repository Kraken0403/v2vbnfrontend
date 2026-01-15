import { ref } from 'vue'

export const useMemberProfile = () => {
  const { $api } = useNuxtApp()

  const profile = ref<Record<string, any>>({})
  const contact = ref<Record<string, any>>({})
  const loading = ref(false)
  const error = ref<string | null>(null)

  const load = async (memberId: number) => {
    loading.value = true
    error.value = null

    try {
      const profileReq = $api.get(`/members/${memberId}/profile`)
      const contactReq = $api.get(`/members/${memberId}/contact`)

      const [profileRes, contactRes] = await Promise.allSettled([
        profileReq,
        contactReq,
      ])

      profile.value =
        profileRes.status === 'fulfilled' && profileRes.value.data
          ? profileRes.value.data
          : {}

      contact.value =
        contactRes.status === 'fulfilled' && contactRes.value.data
          ? contactRes.value.data
          : {}

    } catch (e: any) {
      error.value =
        e?.response?.data?.message ??
        'Failed to load profile'
    } finally {
      loading.value = false
    }
  }

  return {
    profile,
    contact,
    loading,
    error,
    load,
  }
}
