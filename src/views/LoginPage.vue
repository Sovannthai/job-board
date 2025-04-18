<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const userType = ref<'employer' | 'candidate' | 'admin'>('candidate')
const loading = ref(false)
const error = ref('')

const formValid = computed(() => {
  return email.value.trim() !== '' && password.value.trim() !== ''
})

async function login() {
  if (!formValid.value) {
    error.value = 'Please fill in all fields'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // In a real app, we would make an API call here
    const success = authStore.login(email.value, userType.value)
    
    if (success) {
      // Redirect based on user type
      if (userType.value === 'employer') {
        router.push('/employer')
      } else if (userType.value === 'candidate') {
        router.push('/candidate')
      } else if (userType.value === 'admin') {
        router.push('/admin')
      }
    } else {
      error.value = 'Invalid email or password'
    }
  } catch (e) {
    error.value = 'An error occurred. Please try again.'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12 sm:py-16 lg:py-24">
    <div class="container mx-auto px-4">
      <div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-8">
          <div class="text-center mb-8">
            <h1 class="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p class="text-gray-600">Sign in to your account to continue</p>
          </div>
          
          <form @submit.prevent="login" class="space-y-6">
            <!-- User Type Selection -->
            <div class="flex rounded-md shadow-sm">
              <button
                type="button"
                class="flex-1 py-2 px-4 border border-gray-300 text-center font-medium rounded-l-md transition-colors"
                :class="userType === 'candidate' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 hover:bg-gray-50'"
                @click="userType = 'candidate'"
              >
                Candidate
              </button>
              <button
                type="button"
                class="flex-1 py-2 px-4 border border-gray-300 text-center font-medium transition-colors"
                :class="userType === 'employer' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 hover:bg-gray-50'"
                @click="userType = 'employer'"
              >
                Employer
              </button>
              <button
                type="button"
                class="flex-1 py-2 px-4 border border-gray-300 text-center font-medium rounded-r-md transition-colors"
                :class="userType === 'admin' ? 'bg-primary-500 text-white border-primary-500' : 'bg-white text-gray-700 hover:bg-gray-50'"
                @click="userType = 'admin'"
              >
                Admin
              </button>
            </div>
            
            <!-- Email Field -->
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                id="email"
                type="email"
                v-model="email"
                autocomplete="email"
                required
                class="form-input"
                placeholder="Enter your email"
              />
            </div>
            
            <!-- Password Field -->
            <div>
              <div class="flex items-center justify-between mb-1">
                <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
                <a href="#" class="text-sm text-primary-600 hover:text-primary-500">Forgot password?</a>
              </div>
              <input
                id="password"
                type="password"
                v-model="password"
                autocomplete="current-password"
                required
                class="form-input"
                placeholder="Enter your password"
              />
            </div>
            
            <!-- Remember Me -->
            <div class="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label for="remember-me" class="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>
            
            <!-- Error Message -->
            <div v-if="error" class="text-error-600 text-sm font-medium">
              {{ error }}
            </div>
            
            <!-- Login Button -->
            <div>
              <button
                type="submit"
                :disabled="loading || !formValid"
                class="btn btn-primary w-full py-2"
                :class="{ 'opacity-75 cursor-not-allowed': loading || !formValid }"
              >
                <svg
                  v-if="loading"
                  class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sign In
              </button>
            </div>
          </form>
          
          <div class="mt-6 text-center">
            <p class="text-sm text-gray-600">
              Don't have an account?
              <router-link to="/register" class="font-medium text-primary-600 hover:text-primary-500">
                Register
              </router-link>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>