<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

// Mobile menu state
const mobileMenuOpen = ref(false)

// Auth state
const isAuthenticated = computed(() => authStore.isAuthenticated())
const userRole = computed(() => authStore.getUserRole())

// Toggle mobile menu
function toggleMobileMenu() {
  mobileMenuOpen.value = !mobileMenuOpen.value
}

// Close mobile menu
function closeMobileMenu() {
  mobileMenuOpen.value = false
}

// Logout
function logout() {
  authStore.logout()
  router.push('/')
  closeMobileMenu()
}
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white border-b border-gray-100 shadow-sm">
    <div class="container px-4 py-4 mx-auto">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center">
          <router-link to="/" class="flex items-center text-2xl font-bold transition-transform duration-200 hover:scale-105">
            <span class="text-primary-600">Job</span><span class="text-accent-500">Board</span>
          </router-link>
        </div>

        <!-- Desktop Navigation -->
        <nav class="items-center hidden space-x-6 md:flex">
          <router-link 
            to="/" 
            class="text-gray-700 hover:text-primary-600 transition-colors duration-200"
            active-class="text-primary-600 font-medium"
          >
            Jobs
          </router-link>
          
          <template v-if="!isAuthenticated">
            <router-link 
              to="/login" 
              class="text-gray-700 hover:text-primary-600 transition-colors duration-200"
              active-class="text-primary-600 font-medium"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              class="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-lg bg-primary-600 hover:bg-primary-700"
            >
              Register
            </router-link>
          </template>

          <template v-else>
            <template v-if="userRole === 'employer'">
              <router-link 
                to="/employer" 
                class="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                active-class="text-primary-600 font-medium"
              >
                Dashboard
              </router-link>
              <router-link 
                to="/employer/post-job" 
                class="px-4 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-lg bg-primary-600 hover:bg-primary-700"
              >
                Post a Job
              </router-link>
            </template>

            <template v-else-if="userRole === 'candidate'">
              <router-link 
                to="/candidate" 
                class="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                active-class="text-primary-600 font-medium"
              >
                My Applications
              </router-link>
            </template>

            <template v-else-if="userRole === 'admin'">
              <router-link 
                to="/admin" 
                class="text-gray-700 hover:text-primary-600 transition-colors duration-200"
                active-class="text-primary-600 font-medium"
              >
                Admin Panel
              </router-link>
            </template>

            <button 
              @click="logout" 
              class="text-gray-700 hover:text-error-600 transition-colors duration-200"
            >
              Logout
            </button>
          </template>
        </nav>

        <!-- Mobile Menu Button -->
        <button 
          @click="toggleMobileMenu" 
          class="p-2 transition-colors duration-200 rounded-md md:hidden hover:bg-gray-100"
          aria-label="Toggle Menu"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            class="w-6 h-6 text-gray-700" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
            aria-hidden="true"
          >
            <path 
              v-if="!mobileMenuOpen" 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M4 6h16M4 12h16M4 18h16"
            />
            <path 
              v-else 
              stroke-linecap="round" 
              stroke-linejoin="round" 
              stroke-width="2" 
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div 
      v-show="mobileMenuOpen" 
      class="md:hidden"
    >
      <nav class="container px-4 py-3 mx-auto border-t border-gray-100">
        <div class="flex flex-col space-y-3">
          <router-link 
            to="/" 
            @click="closeMobileMenu"
            class="py-2 text-gray-700 transition-colors duration-200 border-b border-gray-100 hover:text-primary-600"
            active-class="text-primary-600 font-medium"
          >
            Jobs
          </router-link>
          
          <template v-if="!isAuthenticated">
            <router-link 
              to="/login" 
              @click="closeMobileMenu"
              class="py-2 text-gray-700 transition-colors duration-200 border-b border-gray-100 hover:text-primary-600"
              active-class="text-primary-600 font-medium"
            >
              Login
            </router-link>
            <router-link 
              to="/register" 
              @click="closeMobileMenu"
              class="inline-block px-4 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-lg w-fit bg-primary-600 hover:bg-primary-700"
            >
              Register
            </router-link>
          </template>

          <template v-else>
            <template v-if="userRole === 'employer'">
              <router-link 
                to="/employer" 
                @click="closeMobileMenu"
                class="py-2 text-gray-700 transition-colors duration-200 border-b border-gray-100 hover:text-primary-600"
                active-class="text-primary-600 font-medium"
              >
                Dashboard
              </router-link>
              <router-link 
                to="/employer/post-job" 
                @click="closeMobileMenu"
                class="inline-block px-4 py-2 text-sm font-medium text-white transition-colors duration-200 rounded-lg w-fit bg-primary-600 hover:bg-primary-700"
              >
                Post a Job
              </router-link>
            </template>

            <template v-else-if="userRole === 'candidate'">
              <router-link 
                to="/candidate" 
                @click="closeMobileMenu"
                class="py-2 text-gray-700 transition-colors duration-200 border-b border-gray-100 hover:text-primary-600"
                active-class="text-primary-600 font-medium"
              >
                My Applications
              </router-link>
            </template>

            <template v-else-if="userRole === 'admin'">
              <router-link 
                to="/admin" 
                @click="closeMobileMenu"
                class="py-2 text-gray-700 transition-colors duration-200 border-b border-gray-100 hover:text-primary-600"
                active-class="text-primary-600 font-medium"
              >
                Admin Panel
              </router-link>
            </template>

            <button 
              @click="logout" 
              class="py-2 text-left text-gray-700 transition-colors duration-200 hover:text-error-600"
            >
              Logout
            </button>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.router-link-active {
  color: var(--color-primary-500);
  font-weight: 500;
}

header {
  width: 100%;
  max-width: 100%;
}
</style>