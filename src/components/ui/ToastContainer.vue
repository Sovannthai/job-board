<script setup lang="ts">
import { ref, defineExpose } from 'vue'
import type { ToastMessage } from '../../types'

const toasts = ref<ToastMessage[]>([])

// Add a toast message
function addToast({ type, message, duration = 5000 }: { type: 'success' | 'error' | 'info' | 'warning', message: string, duration?: number }) {
  const id = Date.now().toString()
  const toast: ToastMessage = { id, type, message, duration }
  toasts.value.push(toast)
  
  // Auto remove toast after duration
  setTimeout(() => {
    removeToast(id)
  }, duration)
}

// Remove toast by id
function removeToast(id: string) {
  const index = toasts.value.findIndex(toast => toast.id === id)
  if (index !== -1) {
    toasts.value.splice(index, 1)
  }
}

defineExpose({
  addToast
})
</script>

<template>
  <div class="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
    <transition-group name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id"
        class="min-w-[280px] md:min-w-[320px] max-w-sm p-4 rounded-lg shadow-lg flex items-start pointer-events-auto"
        :class="{
          'bg-success-50 border-l-4 border-success-500 text-success-800': toast.type === 'success',
          'bg-error-50 border-l-4 border-error-500 text-error-800': toast.type === 'error',
          'bg-primary-50 border-l-4 border-primary-500 text-primary-800': toast.type === 'info',
          'bg-warning-50 border-l-4 border-warning-500 text-warning-800': toast.type === 'warning'
        }"
      >
        <!-- Icon -->
        <div class="mr-3 flex-shrink-0">
          <!-- Success Icon -->
          <svg v-if="toast.type === 'success'" class="h-5 w-5 text-success-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          
          <!-- Error Icon -->
          <svg v-else-if="toast.type === 'error'" class="h-5 w-5 text-error-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
          
          <!-- Info Icon -->
          <svg v-else-if="toast.type === 'info'" class="h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
          </svg>
          
          <!-- Warning Icon -->
          <svg v-else-if="toast.type === 'warning'" class="h-5 w-5 text-warning-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
          </svg>
        </div>
        
        <!-- Content -->
        <div class="flex-grow">
          <p class="text-sm font-medium">
            {{ toast.message }}
          </p>
        </div>
        
        <!-- Close Button -->
        <button 
          @click="removeToast(toast.id)" 
          class="ml-4 flex-shrink-0 bg-transparent text-current opacity-70 hover:opacity-100 transition-opacity focus:outline-none rounded-full p-1"
          aria-label="Close"
        >
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
          </svg>
        </button>
      </div>
    </transition-group>
  </div>
</template>

<style>
.toast-enter-active,
.toast-leave-active {
  @apply transition-all duration-300 ease-in-out;
}

.toast-enter-from,
.toast-leave-to {
  @apply opacity-0 translate-x-8;
}
</style>