<script setup lang="ts">
import { ref, computed, reactive, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useJobStore } from '../../stores/jobStore'
import { useRouter } from 'vue-router'
import type { Employer } from '../../types'

const authStore = useAuthStore()
const jobStore = useJobStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated())
const userRole = computed(() => authStore.getUserRole())
const employer = computed(() => authStore.user as Employer)

// Check if authorized
onMounted(() => {
  if (!isAuthenticated.value || userRole.value !== 'employer') {
    router.push('/login')
  }
})

const jobTypes = [
  'Full-time',
  'Part-time',
  'Contract',
  'Internship',
  'Remote',
  'Temporary'
]

const job = reactive({
  title: '',
  location: '',
  type: '',
  salary: '',
  description: '',
  requirements: ['', '', ''],
  responsibilities: ['', '', ''],
  benefits: ['', '', ''],
  deadline: ''
})

const error = ref('')
const loading = ref(false)
const submitted = ref(false)

const addRequirement = () => {
  job.requirements.push('')
}

const removeRequirement = (index: number) => {
  job.requirements.splice(index, 1)
}

const addResponsibility = () => {
  job.responsibilities.push('')
}

const removeResponsibility = (index: number) => {
  job.responsibilities.splice(index, 1)
}

const addBenefit = () => {
  job.benefits.push('')
}

const removeBenefit = (index: number) => {
  job.benefits.splice(index, 1)
}

const formValid = computed(() => {
  const baseValid = 
    job.title.trim() !== '' && 
    job.location.trim() !== '' && 
    job.type !== '' &&
    job.salary.trim() !== '' &&
    job.description.trim() !== '' &&
    job.deadline.trim() !== ''

  // Check if at least one requirement, responsibility, and benefit is filled out
  const requirementsValid = job.requirements.some(req => req.trim() !== '')
  const responsibilitiesValid = job.responsibilities.some(resp => resp.trim() !== '')
  const benefitsValid = job.benefits.some(ben => ben.trim() !== '')
  
  return baseValid && requirementsValid && responsibilitiesValid && benefitsValid
})

const submitJob = () => {
  if (!formValid.value) {
    error.value = 'Please fill in all required fields'
    return
  }
  
  if (!employer.value) {
    error.value = 'You must be logged in to post a job'
    return
  }
  
  loading.value = true
  error.value = ''
  
  try {
    // Clean up empty fields
    const cleanedRequirements = job.requirements.filter(req => req.trim() !== '')
    const cleanedResponsibilities = job.responsibilities.filter(resp => resp.trim() !== '')
    const cleanedBenefits = job.benefits.filter(ben => ben.trim() !== '')
    
    jobStore.addJob({
      title: job.title,
      company: employer.value.companyName,
      location: job.location,
      type: job.type,
      salary: job.salary,
      description: job.description,
      requirements: cleanedRequirements,
      responsibilities: cleanedResponsibilities,
      benefits: cleanedBenefits,
      postedDate: new Date().toISOString().split('T')[0],
      deadline: job.deadline,
      logo: employer.value.logo,
      companyId: employer.value.id
    })
    
    submitted.value = true
    
    // Reset form after successful submission
    setTimeout(() => {
      // Redirect to employer dashboard
      router.push('/employer')
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
      <div v-if="!submitted" class="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div class="p-6 sm:p-8">
          <h1 class="text-2xl font-bold mb-6">Post a New Job</h1>
          
          <form @submit.prevent="submitJob" class="space-y-6">
            <!-- Basic Information -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="job-title" class="block text-sm font-medium text-gray-700 mb-1">Job Title <span class="text-error-500">*</span></label>
                <input
                  id="job-title"
                  type="text"
                  v-model="job.title"
                  required
                  class="form-input"
                  placeholder="e.g., Senior Web Developer"
                />
              </div>
              
              <div>
                <label for="job-location" class="block text-sm font-medium text-gray-700 mb-1">Location <span class="text-error-500">*</span></label>
                <input
                  id="job-location"
                  type="text"
                  v-model="job.location"
                  required
                  class="form-input"
                  placeholder="e.g., San Francisco, CA or Remote"
                />
              </div>
              
              <div>
                <label for="job-type" class="block text-sm font-medium text-gray-700 mb-1">Job Type <span class="text-error-500">*</span></label>
                <select
                  id="job-type"
                  v-model="job.type"
                  required
                  class="form-select"
                >
                  <option value="" disabled selected>Select job type</option>
                  <option v-for="type in jobTypes" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
              </div>
              
              <div>
                <label for="job-salary" class="block text-sm font-medium text-gray-700 mb-1">Salary <span class="text-error-500">*</span></label>
                <input
                  id="job-salary"
                  type="text"
                  v-model="job.salary"
                  required
                  class="form-input"
                  placeholder="e.g., $80,000 - $100,000 or $50 per hour"
                />
              </div>
              
              <div class="md:col-span-2">
                <label for="deadline" class="block text-sm font-medium text-gray-700 mb-1">Application Deadline <span class="text-error-500">*</span></label>
                <input
                  id="deadline"
                  type="date"
                  v-model="job.deadline"
                  required
                  class="form-input"
                  :min="new Date().toISOString().split('T')[0]"
                />
              </div>
            </div>
            
            <!-- Job Description -->
            <div>
              <label for="job-description" class="block text-sm font-medium text-gray-700 mb-1">Job Description <span class="text-error-500">*</span></label>
              <textarea
                id="job-description"
                v-model="job.description"
                required
                rows="5"
                class="form-textarea"
                placeholder="Provide a detailed description of the job..."
              ></textarea>
            </div>
            
            <!-- Requirements -->
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-sm font-medium text-gray-700">Requirements <span class="text-error-500">*</span></label>
                <button 
                  type="button" 
                  @click="addRequirement"
                  class="text-sm text-primary-600 hover:text-primary-500 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Requirement
                </button>
              </div>
              <div class="space-y-3">
                <div v-for="(_, index) in job.requirements" :key="`req-${index}`" class="flex items-center">
                  <input
                    :id="`requirement-${index}`"
                    type="text"
                    v-model="job.requirements[index]"
                    class="form-input flex-grow"
                    :placeholder="`Requirement ${index + 1}`"
                  />
                  <button 
                    v-if="job.requirements.length > 1"
                    type="button" 
                    @click="removeRequirement(index)"
                    class="ml-2 text-gray-400 hover:text-error-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Responsibilities -->
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-sm font-medium text-gray-700">Responsibilities <span class="text-error-500">*</span></label>
                <button 
                  type="button" 
                  @click="addResponsibility"
                  class="text-sm text-primary-600 hover:text-primary-500 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Responsibility
                </button>
              </div>
              <div class="space-y-3">
                <div v-for="(_, index) in job.responsibilities" :key="`resp-${index}`" class="flex items-center">
                  <input
                    :id="`responsibility-${index}`"
                    type="text"
                    v-model="job.responsibilities[index]"
                    class="form-input flex-grow"
                    :placeholder="`Responsibility ${index + 1}`"
                  />
                  <button 
                    v-if="job.responsibilities.length > 1"
                    type="button" 
                    @click="removeResponsibility(index)"
                    class="ml-2 text-gray-400 hover:text-error-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Benefits -->
            <div>
              <div class="flex justify-between items-center mb-1">
                <label class="block text-sm font-medium text-gray-700">Benefits <span class="text-error-500">*</span></label>
                <button 
                  type="button" 
                  @click="addBenefit"
                  class="text-sm text-primary-600 hover:text-primary-500 flex items-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Benefit
                </button>
              </div>
              <div class="space-y-3">
                <div v-for="(_, index) in job.benefits" :key="`ben-${index}`" class="flex items-center">
                  <input
                    :id="`benefit-${index}`"
                    type="text"
                    v-model="job.benefits[index]"
                    class="form-input flex-grow"
                    :placeholder="`Benefit ${index + 1}`"
                  />
                  <button 
                    v-if="job.benefits.length > 1"
                    type="button" 
                    @click="removeBenefit(index)"
                    class="ml-2 text-gray-400 hover:text-error-500"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
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
                @click="router.push('/employer')"
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
                Post Job
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div 
        v-else 
        class="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden p-8 text-center"
      >
        <div class="rounded-full bg-success-100 p-3 w-16 h-16 flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-success-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Job Posted Successfully!</h2>
        <p class="text-gray-600 mb-6 max-w-md mx-auto">
          Your job has been submitted for review. Once approved, it will be visible to all job seekers on our platform.
        </p>
        <p class="text-sm text-gray-500 mb-4">Redirecting to your dashboard...</p>
        <div class="flex justify-center">
          <button
            @click="router.push('/employer')"
            class="btn btn-primary"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  </div>
</template>