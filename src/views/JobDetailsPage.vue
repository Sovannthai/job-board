<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useJobStore } from '../stores/jobStore'
import { useAuthStore } from '../stores/authStore'
import { useApplicationStore } from '../stores/applicationStore'

const route = useRoute()
const router = useRouter()
const jobStore = useJobStore()
const authStore = useAuthStore()
const applicationStore = useApplicationStore()

const jobId = computed(() => route.params.id as string)
const job = computed(() => jobStore.getJobById(jobId.value))
const isAuthenticated = computed(() => authStore.isAuthenticated())
const userRole = computed(() => authStore.getUserRole())

const hasApplied = computed(() => {
  if (!isAuthenticated.value || userRole.value !== 'candidate') return false
  const candidateId = authStore.user?.id
  const applications = applicationStore.applications
  return applications.some(app => app.jobId === jobId.value && app.candidateId === candidateId)
})

// Formatted date
const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Scroll to top on mount
onMounted(() => {
  window.scrollTo(0, 0)
})

// Redirect if job not found
if (!job.value) {
  router.push('/')
}

// Apply to job
function applyToJob() {
  if (!isAuthenticated.value) {
    router.push('/login')
    return
  }
  
  router.push(`/jobs/${jobId.value}/apply`)
}
</script>

<template>
  <div class="bg-gray-50 py-8">
    <div class="container mx-auto px-4">
      <div v-if="job" class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <!-- Job Header -->
        <div class="bg-primary-50 p-6 sm:p-8 border-b border-gray-200">
          <div class="flex flex-col md:flex-row md:items-center">
            <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img 
                :src="job.logo || ''" 
                :alt="`${job.company} logo`"
                class="w-20 h-20 md:w-24 md:h-24 rounded-lg object-cover bg-white p-1 border border-gray-200"
              />
            </div>
            <div class="flex-grow">
              <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{{ job.title }}</h1>
              <div class="flex flex-wrap gap-y-2">
                <div class="flex items-center mr-4 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  {{ job.company }}
                </div>
                <div class="flex items-center mr-4 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {{ job.location }}
                </div>
                <div class="flex items-center mr-4 text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  {{ job.type }}
                </div>
                <div class="flex items-center text-gray-700">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ job.salary }}
                </div>
              </div>
            </div>
            <div class="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
              <button 
                @click="applyToJob"
                class="btn btn-primary w-full sm:w-auto"
                :disabled="hasApplied"
              >
                <span v-if="hasApplied">Already Applied</span>
                <span v-else>Apply Now</span>
              </button>
              <p v-if="job.deadline" class="text-sm text-gray-500 mt-2">
                Application Deadline: {{ formatDate(job.deadline) }}
              </p>
            </div>
          </div>
        </div>
        
        <!-- Job Details -->
        <div class="p-6 sm:p-8">
          <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div class="lg:col-span-2">
              <section class="mb-8">
                <h2 class="text-xl font-semibold mb-4 text-gray-900">Job Description</h2>
                <p class="text-gray-700 whitespace-pre-line">{{ job.description }}</p>
              </section>
              
              <section class="mb-8">
                <h2 class="text-xl font-semibold mb-4 text-gray-900">Requirements</h2>
                <ul class="space-y-2">
                  <li 
                    v-for="(req, index) in job.requirements" 
                    :key="index"
                    class="flex items-start"
                  >
                    <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-primary-100 text-primary-800 mr-2 flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span class="text-gray-700">{{ req }}</span>
                  </li>
                </ul>
              </section>
              
              <section class="mb-8">
                <h2 class="text-xl font-semibold mb-4 text-gray-900">Responsibilities</h2>
                <ul class="space-y-2">
                  <li 
                    v-for="(resp, index) in job.responsibilities" 
                    :key="index"
                    class="flex items-start"
                  >
                    <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-secondary-100 text-secondary-800 mr-2 flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span class="text-gray-700">{{ resp }}</span>
                  </li>
                </ul>
              </section>
            </div>
            
            <div class="lg:col-span-1">
              <div class="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-900">Job Overview</h3>
                <ul class="space-y-4">
                  <li class="flex items-start">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary-100 text-primary-600 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-sm text-gray-500">Posted Date</span>
                      <span class="block text-gray-700">{{ formatDate(job.postedDate) }}</span>
                    </div>
                  </li>
                  <li class="flex items-start">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary-100 text-primary-600 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-sm text-gray-500">Deadline</span>
                      <span class="block text-gray-700">{{ formatDate(job.deadline) }}</span>
                    </div>
                  </li>
                  <li class="flex items-start">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary-100 text-primary-600 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-sm text-gray-500">Location</span>
                      <span class="block text-gray-700">{{ job.location }}</span>
                    </div>
                  </li>
                  <li class="flex items-start">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary-100 text-primary-600 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-sm text-gray-500">Job Type</span>
                      <span class="block text-gray-700">{{ job.type }}</span>
                    </div>
                  </li>
                  <li class="flex items-start">
                    <div class="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-md bg-primary-100 text-primary-600 mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <span class="block text-sm text-gray-500">Salary</span>
                      <span class="block text-gray-700">{{ job.salary }}</span>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div class="bg-gray-50 rounded-lg p-6">
                <h3 class="text-lg font-semibold mb-4 text-gray-900">Benefits</h3>
                <ul class="space-y-2">
                  <li 
                    v-for="(benefit, index) in job.benefits" 
                    :key="index"
                    class="flex items-start"
                  >
                    <span class="inline-flex items-center justify-center h-5 w-5 rounded-full bg-accent-100 text-accent-800 mr-2 flex-shrink-0 mt-0.5">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </span>
                    <span class="text-gray-700">{{ benefit }}</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Call to Action -->
        <div class="bg-gray-50 border-t border-gray-200 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center">
          <div class="mb-4 sm:mb-0 text-center sm:text-left">
            <p class="text-gray-600 mb-1">Interested in this job?</p>
            <h3 class="text-xl font-semibold text-gray-900">Apply now and take the next step in your career</h3>
          </div>
          <button 
            @click="applyToJob"
            class="btn btn-primary"
            :disabled="hasApplied"
          >
            <span v-if="hasApplied">Already Applied</span>
            <span v-else>Apply for This Job</span>
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