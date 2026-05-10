import { reactive } from 'vue'

const state = reactive({
  isOpen: false,
  title: '',
  message: '',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  tone: 'danger',
  input: null,
  inputValue: '',
  resolve: null,
})

function openDialog(options = {}) {
  state.isOpen = true
  state.title = options.title || 'Confirm action'
  state.message = options.message || ''
  state.confirmText = options.confirmText || 'Confirm'
  state.cancelText = options.cancelText || 'Cancel'
  state.tone = options.tone || 'danger'
  state.input = options.input || null
  state.inputValue = options.input?.value || ''

  return new Promise((resolve) => {
    state.resolve = resolve
  })
}

function closeDialog(result) {
  state.isOpen = false
  state.resolve?.(result)
  state.resolve = null
  state.inputValue = ''
  state.input = null
}

export function useConfirmDialog() {
  return {
    dialogState: state,
    confirmDialog: (options) => openDialog(options),
    promptDialog: (options) => openDialog(options),
    confirmDialogAction: () => {
      closeDialog(state.input ? { confirmed: true, value: state.inputValue } : true)
    },
    cancelDialogAction: () => {
      closeDialog(state.input ? { confirmed: false, value: '' } : false)
    },
  }
}
