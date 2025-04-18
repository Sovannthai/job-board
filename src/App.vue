<script setup lang="ts">
import { ref, onMounted, getCurrentInstance } from 'vue'
import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'
import ToastContainer from './components/ui/ToastContainer.vue'

const toastContainer = ref<InstanceType<typeof ToastContainer> | null>(null)

// Function to show toast notification
const showToast = (type: 'success' | 'error' | 'info' | 'warning', message: string, duration?: number) => {
  if (toastContainer.value) {
    toastContainer.value.addToast({
      type,
      message,
      duration
    })
  }
}

// Expose the showToast function to be used in other components via provide/inject
// or through the global property
onMounted(() => {
  const app = getCurrentInstance()
  if (app) {
    app.appContext.app.config.globalProperties.$toast = showToast
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <TheHeader />
    
    <main class="flex-1 w-full">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    
    <TheFooter />
    
    <ToastContainer ref="toastContainer" />
  </div>
</template>

<style>
.page-enter-active,
.page-leave-active {
  @apply transition-all duration-300;
}

.page-enter-from {
  @apply opacity-0 translate-x-5;
}

.page-leave-to {
  @apply opacity-0 -translate-x-5;
}
</style>