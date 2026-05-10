<script setup>
import { computed, nextTick, ref, watch } from 'vue'
import { useConfirmDialog } from '@/composables/useConfirmDialog'

const inputRef = ref(null)
const {
  dialogState,
  confirmDialogAction,
  cancelDialogAction,
} = useConfirmDialog()

const confirmButtonClass = computed(() =>
  dialogState.tone === 'danger'
    ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
    : 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
)

watch(
  () => dialogState.isOpen,
  async (isOpen) => {
    if (isOpen && dialogState.input) {
      await nextTick()
      inputRef.value?.focus()
    }
  },
)
</script>

<template>
  <Teleport to="body">
    <div
      v-if="dialogState.isOpen"
      class="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 px-4"
      @click.self="cancelDialogAction"
    >
      <div class="w-full max-w-md rounded-xl bg-white shadow-xl border border-gray-200">
        <div class="p-6">
          <h2 class="text-lg font-semibold text-gray-900">{{ dialogState.title }}</h2>
          <p v-if="dialogState.message" class="mt-2 text-sm text-gray-600">
            {{ dialogState.message }}
          </p>

          <label v-if="dialogState.input" class="mt-4 block">
            <span class="block text-sm font-medium text-gray-700">
              {{ dialogState.input.label }}
            </span>
            <textarea
              v-if="dialogState.input.type === 'textarea'"
              ref="inputRef"
              v-model="dialogState.inputValue"
              :placeholder="dialogState.input.placeholder"
              rows="3"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            ></textarea>
            <input
              v-else
              ref="inputRef"
              v-model="dialogState.inputValue"
              :placeholder="dialogState.input.placeholder"
              class="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
            >
          </label>
        </div>

        <div class="flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4 rounded-b-xl">
          <button
            type="button"
            class="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-white"
            @click="cancelDialogAction"
          >
            {{ dialogState.cancelText }}
          </button>
          <button
            type="button"
            :class="`px-4 py-2 rounded-lg text-sm font-medium text-white focus:outline-none focus:ring-2 ${confirmButtonClass}`"
            @click="confirmDialogAction"
          >
            {{ dialogState.confirmText }}
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>
