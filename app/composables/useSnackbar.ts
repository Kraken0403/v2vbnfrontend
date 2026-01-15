type SnackbarType = 'success' | 'error' | 'info'

export const useSnackbar = () => {
  const show = useState<boolean>('snackbar:show', () => false)
  const message = useState<string>('snackbar:message', () => '')
  const type = useState<SnackbarType>('snackbar:type', () => 'info')

  const open = (msg: string, t: SnackbarType = 'info') => {
    message.value = msg
    type.value = t
    show.value = true

    setTimeout(() => {
      show.value = false
    }, 3000)
  }

  const close = () => {
    show.value = false
  }

  return {
    show,
    message,
    type,
    open,
    close,
  }
}
