<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/authStore'
import { useJobStore } from '../../stores/jobStore'
import { useApplicationStore } from '../../stores/applicationStore'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const jobStore = useJobStore()
const appStore = useApplicationStore()

const jobId = computed(() => route.params.id as string)
const job = computed(() => jobStore.getJobById(jobId.value))
const isAuthenticated = computed(() => authStore.isAuthenticated())
const userRole = computed(() => authStore.getUserRole())
const candidate = computed(() => authStore.user)

// Check if authorized
onMounted(() => {
  if (!isAuthenticated.value || userRole.value !== 'candidate') {
    router.push('/login')
  }
  
  if (!job.value) {
    router.push('/')
  }
  
  // Check if already applied
  if (hasApplied.value) {
    router.push(`/jobs/${jobId.value}`)
  }
})

const hasApplied = computed(() => {
  if (!isAuthenticated.value || userRole.value !== 'candidate' || !candidate.value) return false
  const candidateId = candidate.value.id
  const applications = appStore.applications
  return applications.some(app => app.jobId === jobId.value && app.candidateId === candidateId)
})

const coverLetter = ref('')
const resumeFile = ref<File | null>(null)
const loading = ref(false)
const error = ref('')
const submitted = ref(false)

const formValid = computed(() => {
  return coverLetter.value.trim() !== ''
})

function handleFileUpload(event: Event) {
  const target = event.target as HTMLInputElement
  if (target.files && target.files.length > 0) {
    resumeFile.value = target.files[0]
  }
}

async function submitApplication() {
  if (!formValid.value) {
    error.value = 'Please fill in all required fields'
    return
  }
  
  if (!candidate.value) {
    error.value = 'You must be logged in to apply'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // In a real app, we would upload the resume file here and get a URL
    const resumeUrl = resumeFile.value ? 'https://example.com/resume.pdf' : null
    
    appStore.submitApplication({
      jobId: jobId.value,
      candidateId: candidate.value.id,
      coverLetter: coverLetter.value,
      resumeUrl
    })
    
    submitted.value = true
    
    // Redirect after successful submission
    setTimeout(() => {
      router.push('/candidate')
    }, 3000)
  } catch (e) {
    error.value = 'An error occurred. Please try again.'
    console.error(e)
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div v-if="job && !submitted" class="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 sm:p-8">
          <div class="flex items-center mb-6">
            <img 
              :src="job.logo || ''" 
              :alt="`${job.company} logo`"
              class="w-16 h-16 rounded-lg object-cover mr-4"
            />
            <div>
              <h1 class="text-2xl font-bold text-gray-900">Apply for {{ job.title }}</h1>
              <p class="text-gray-600">{{ job.company }} · {{ job.location }}</p>
            </div>
          </div>
          
          <form @submit.prevent="submitApplication" class="space-y-6">
            <!-- Cover Letter -->
            <div>
              <label for="cover-letter" class="block text-sm font-medium text-gray-700 mb-1">Cover Letter <span class="text-error-500">*</span></label>
              <textarea
                id="cover-letter"
                v-model="coverLetter"
                required
                rows="8"
                class="form-textarea"
                placeholder="Introduce yourself and explain why you're a good fit for this position..."
              ></textarea>
            </div>
            
            <!-- Resume Upload -->
            <div>
              <label for="resume" class="block text-sm font-medium text-gray-700 mb-1">Resume (Optional)</label>
              <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                <div class="space-y-1 text-center">
                  <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                  <div class="flex text-sm text-gray-600">
                    <label for="file-upload" class="relative cursor-pointer bg-white rounded-md font-medium text-primary-600 hover:text-primary-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-500">
                      <span>Upload a file</span>
                      <input id="file-upload" name="file-upload" type="file" class="sr-only" @change="handleFileUpload" accept=".pdf,.doc,.docx">
                    </label>
                    <p class="pl-1">or drag and drop</p>
                  </div>
                  <p class="text-xs text-gray-500">
                    PDF, DOC, DOCX up to 10MB
                  </p>
                  <p v-if="resumeFile" class="text-sm text-primary-600 mt-2">
                    Selected file: {{ resumeFile.name }}
                  </p>
                </div>
              </div>
            </div>
            
            <!-- Error Message -->
            <div v-if="error" class="text-error-600 text-sm font-medium">
              {{ error }}
            </div>
            
            <!-- Submit Button -->
            <div class="flex justify-end">
              <button
                type="button"
                @click="router.push(`/jobs/${jobId}`)"
                class="btn btn-outline mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                :disabled="loading || !formValid"
                class="btn btn-primary"
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
                Submit Application
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div 
        v-else-if="submitted" 
        class="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8 text-center"
      >
        <div class="rounded-full bg-success-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Application Submitted!</h2>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">
          Your application has been successfully submitted. The employer will review your application and contact you if they're interested.
        </p>
        <p class="text-sm text-gray-500 mb-4">Redirecting to your dashboard...</p>
        <div class="flex justify-center">
          <button
            @click="router.push('/candidate')"
            class="btn btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
      
      <div v-else class="text-center py-16 bg-white rounded-lg shadow-md">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 class="text-2xl font-semibold text-gray-700 mb-2">Job Not Found</h2>
        <p class="text-gray-500 max-w-md mx-auto mb-6">
          Sorry, the job you're looking for doesn't exist or has been removed.
        </p>
        <router-link to="/" class="btn btn-primary">
          Browse Available Jobs
        </router-link>
      </div>
    </div>
  </div>
</template>