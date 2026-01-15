export const useMeetings = () => {
    const { $api } = useNuxtApp()
  
    /**
     * Get meetings of my active chapter
     */
    const getMyMeetings = async () => {
      const { data } = await $api.get('/meetings/my')
      return data
    }
  
    /**
     * Get single meeting (my chapter)
     */
    const getMyMeeting = async (id: number) => {
      const { data } = await $api.get(`/meetings/my/${id}`)
      return data
    }
  
    /**
     * Create meeting (Leadership only)
     */
    const createMeeting = async (payload: {
      title: string
      meeting_at: string
      venue?: string
      map_link?: string
    }) => {
      const { data } = await $api.post('/meetings/my', payload)
      return data
    }
  
    /**
     * Update meeting (Leadership only)
     */
    const updateMeeting = async (
      id: number,
      payload: Record<string, any>,
    ) => {
      const { data } = await $api.patch(
        `/meetings/my/${id}`,
        payload,
      )
      return data
    }
  
    /**
     * Close meeting (Leadership only)
     */
    const closeMeeting = async (id: number) => {
      const { data } = await $api.post(
        `/meetings/my/${id}/close`,
      )
      return data
    }
  
    return {
      getMyMeetings,
      getMyMeeting,
      createMeeting,
      updateMeeting,
      closeMeeting,
    }
  }
  