<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const userType = ref<'employer' | 'candidate'>('candidate')
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const companyName = ref('')
const companySize = ref('')
const industry = ref('')
const location = ref('')
const loading = ref(false)
const error = ref('')
const agreed = ref(false)

const companySizes = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1000+'
]

const industries = [
  'Technology',
  'Healthcare',
  'Finance',
  'Education',
  'Manufacturing',
  'Retail',
  'Transportation',
  'Construction',
  'Entertainment',
  'Other'
]

const formValid = computed(() => {
  const baseValid = 
    name.value.trim() !== '' && 
    email.value.trim() !== '' && 
    password.value.trim() !== '' &&
    password.value === confirmPassword.value &&
    agreed.value

  if (userType.value === 'employer') {
    return baseValid && 
      companyName.value.trim() !== '' && 
      companySize.value !== '' &&
      industry.value !== '' &&
      location.value.trim() !== ''
  }
  
  return baseValid
})

const passwordsMatch = computed(() => {
  return !confirmPassword.value || password.value === confirmPassword.value
})

async function register() {
  if (!formValid.value) {
    error.value = 'Please fill in all required fields'
    return
  }
  
  if (!passwordsMatch.value) {
    error.value = 'Passwords do not match'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // In a real app, we would make an API call here
    let userData: Record<string, any> = {
      name: name.value,
      email: email.value,
    }
    
    if (userType.value === 'employer') {
      userData = {
        ...userData,
        companyName: companyName.value,
        companySize: companySize.value,
        industry: industry.value,
        location: location.value
      }
    }
    
    const success = await authStore.register(userData, userType.value)
    
    if (success) {
      // Redirect based on user type
      if (userType.value === 'employer') {
        router.push('/employer')
      } else {
        router.push('/candidate')
      }
    } else {
      error.value = 'Registration failed. Please try again.'
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
  <div class="bg-gray-50 py-8 md:py-12">
    <div class="container mx-auto px-4">
      <div class="max-w-2xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div class="p-6 md:p-8">
          <div class="text-center mb-8">
            <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Create an Account</h1>
            <p class="text-gray-600">Join our platform to find your dream job or the perfect candidate</p>
          </div>
          
          <!-- User Type Selection -->
          <div class="flex rounded-md shadow-sm mb-8 max-w-md mx-auto">
            <button
              type="button"
              class="flex-1 py-3 px-4 border border-gray-300 text-center font-medium rounded-l-md transition-colors duration-200"
              :class="userType === 'candidate' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
              @click="userType = 'candidate'"
            >
              I'm a Job Seeker
            </button>
            <button
              type="button"
              class="flex-1 py-3 px-4 border border-gray-300 text-center font-medium rounded-r-md transition-colors duration-200"
              :class="userType === 'employer' ? 'bg-primary-600 text-white border-primary-600' : 'bg-white text-gray-700 hover:bg-gray-50'"
              @click="userType = 'employer'"
            >
              I'm an Employer
            </button>
          </div>
          
          <!-- Error Alert -->
          <div v-if="error" class="bg-error-50 border-l-4 border-error-500 text-error-700 p-4 mb-6 rounded-md">
            <div class="flex">
              <div class="flex-shrink-0">
                <svg class="h-5 w-5 text-error-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm">{{ error }}</p>
              </div>
            </div>
          </div>
          
          <form @submit.prevent="register" class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Name Field -->
              <div>
                <label for="name" class="form-label">Full Name</label>
                <input
                  id="name"
                  type="text"
                  v-model="name"
                  required
                  class="form-input"
                  placeholder="Enter your full name"
                />
              </div>
              
              <!-- Email Field -->
              <div>
                <label for="email" class="form-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  v-model="email"
                  required
                  class="form-input"
                  placeholder="Enter your email"
                />
              </div>
              
              <!-- Password Field -->
              <div>
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  type="password"
                  v-model="password"
                  required
                  class="form-input"
                  placeholder="Create a password"
                />
              </div>
              
              <!-- Confirm Password Field -->
              <div>
                <label for="confirm-password" class="form-label">Confirm Password</label>
                <input
                  id="confirm-password"
                  type="password"
                  v-model="confirmPassword"
                  required
                  class="form-input"
                  :class="{ 'border-error-300 ring-error-500': confirmPassword && !passwordsMatch }"
                  placeholder="Confirm your password"
                />
                <p v-if="confirmPassword && !passwordsMatch" class="form-error">
                  Passwords do not match
                </p>
              </div>
              
              <!-- Employer-specific fields -->
              <template v-if="userType === 'employer'">
                <div>
                  <label for="company-name" class="form-label">Company Name</label>
                  <input
                    id="company-name"
                    type="text"
                    v-model="companyName"
                    required
                    class="form-input"
                    placeholder="Enter company name"
                  />
                </div>
                
                <div>
                  <label for="company-size" class="form-label">Company Size</label>
                  <select
                    id="company-size"
                    v-model="companySize"
                    required
                    class="form-select"
                  >
                    <option value="" disabled selected>Select company size</option>
                    <option v-for="size in companySizes" :key="size" :value="size">
                      {{ size }} employees
                    </option>
                  </select>
                </div>
                
                <div>
                  <label for="industry" class="form-label">Industry</label>
                  <select
                    id="industry"
                    v-model="industry"
                    required
                    class="form-select"
                  >
                    <option value="" disabled selected>Select industry</option>
                    <option v-for="ind in industries" :key="ind" :value="ind">
                      {{ ind }}
                    </option>
                  </select>
                </div>
                
                <div>
                  <label for="location" class="form-label">Company Location</label>
                  <input
                    id="location"
                    type="text"
                    v-model="location"
                    required
                    class="form-input"
                    placeholder="City, State, Country"
                  />
                </div>
              </template>
            </div>
            
            <!-- Terms of Service -->
            <div class="flex items-start">
              <div class="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  v-model="agreed"
                  required
                  class="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
              </div>
              <div class="ml-3 text-sm">
                <label for="terms" class="text-gray-700">
                  I agree to the 
                  <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Terms of Service</a>
                  and
                  <a href="#" class="text-primary-600 hover:text-primary-700 font-medium">Privacy Policy</a>
                </label>
              </div>
            </div>
            
            <!-- Submit Button -->
            <div class="flex justify-center">
              <button
                type="submit"
                class="btn btn-primary w-full md:w-auto px-8 py-3"
                :disabled="loading || !formValid"
                :class="{'opacity-60 cursor-not-allowed': loading || !formValid}"
              >
                <span v-if="loading" class="flex items-center justify-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating Account...
                </span>
                <span v-else>Create Account</span>
              </button>
            </div>
            
            <!-- Login Link -->
            <div class="text-center text-sm text-gray-600">
              Already have an account? 
              <router-link to="/login" class="text-primary-600 hover:text-primary-700 font-medium">
                Sign in
              </router-link>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>