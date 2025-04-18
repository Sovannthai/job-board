<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed } from 'vue'

const props = defineProps<{
  id: string
  type?: 'success' | 'error' | 'info' | 'warning'
  title?: string
  message: string
  duration?: number
  autoClose?: boolean
}>()

const emit = defineEmits<{
  (e: 'close', id: string): void
}>()

const visible = ref(false)
const progress = ref(100)
const timer = ref<number | null>(null)

// Use a number ref directly for the transition
const visibleValue = ref(0)

// Update the ref when visibility changes
const opacity = computed(() => {
  visibleValue.value = visible.value ? 1 : 0
  return visibleValue.value
})

const translateY = computed(() => {
  return opacity.value * 100 - 100
})

const bgColorClass = computed(() => {
  switch (props.type) {
    case 'success': return 'bg-green-50 border-green-500'
    case 'error': return 'bg-red-50 border-red-500'
    case 'warning': return 'bg-yellow-50 border-yellow-500'
    case 'info': 
    default: return 'bg-blue-50 border-blue-500'
  }
})

const iconColorClass = computed(() => {
  switch (props.type) {
    case 'success': return 'text-green-500'
    case 'error': return 'text-red-500'
    case 'warning': return 'text-yellow-500'
    case 'info': 
    default: return 'text-blue-500'
  }
})

const icons = {
  success: 'M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  error: 'M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
  warning: 'M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z',
  info: 'M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z'
}

function closeToast() {
  visible.value = false
  setTimeout(() => {
    emit('close', props.id)
  }, 300)
}

function startTimer() {
  if (!props.autoClose) return
  
  const duration = props.duration || 5000
  const interval = 10
  const step = 100 / (duration / interval)
  
  timer.value = window.setInterval(() => {
    progress.value = Math.max(0, progress.value - step)
    if (progress.value <= 0) {
      clearInterval(timer.value!)
      closeToast()
    }
  }, interval)
}

function pauseTimer() {
  if (timer.value) {
    clearInterval(timer.value)
  }
}

function resetTimer() {
  pauseTimer()
  startTimer()
}

onMounted(() => {
  visible.value = true
  startTimer()
})

onBeforeUnmount(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
})
</script>

<template>
  <div
    class="toast-notification fixed right-4 max-w-sm w-full overflow-hidden"
    :style="{
      opacity: opacity,
      transform: `translateY(${translateY}%)`,
      top: '1rem'
    }"
    @mouseenter="pauseTimer"
    @mouseleave="resetTimer"
  >
    <div :class="['border-l-4 rounded-md shadow-md p-4', bgColorClass]">
      <div class="flex items-start">
        <div class="flex-shrink-0">
          <svg 
            :class="['w-5 h-5', iconColorClass]" 
            xmlns="http://www.w3.org/2000/svg" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              :d="icons[props.type || 'info']" 
            />
          </svg>
        </div>
        
        <div class="ml-3 w-0 flex-1">
          <div v-if="props.title" class="font-medium text-gray-900">
            {{ props.title }}
          </div>
          <p class="text-sm text-gray-700">
            {{ props.message }}
          </p>
        </div>
        
        <div class="ml-4 flex-shrink-0 flex">
          <button
            class="bg-transparent rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none"
            @click="closeToast"
          >
            <span class="sr-only">Close</span>
            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <!-- Progress bar for auto-close -->
      <div 
        v-if="props.autoClose" 
        class="h-1 bg-gray-200 rounded-full mt-2 overflow-hidden"
      >
        <div 
          class="h-full transition-all duration-100 ease-linear rounded-full"
          :class="[props.type === 'success' ? 'bg-green-500' : 
                  props.type === 'error' ? 'bg-red-500' : 
                  props.type === 'warning' ? 'bg-yellow-500' : 'bg-blue-500']"
          :style="{ width: `${progress}%` }"
        ></div>
      </div>
    </div>
  </div>
</template>