<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useJobStore } from '../../stores/jobStore'
import { useRouter } from 'vue-router'
import { useApplicationStore } from '../../stores/applicationStore'
import type { Employer } from '../../types'

const authStore = useAuthStore()
const jobStore = useJobStore()
const appStore = useApplicationStore()
const router = useRouter()

// Cast the user as Employer type
const employer = computed(() => authStore.user as Employer)
const isAuthenticated = computed(() => authStore.isAuthenticated())
const userRole = computed(() => authStore.getUserRole())

// Check if authorized
onMounted(() => {
  if (!isAuthenticated.value || userRole.value !== 'employer') {
    router.push('/login')
  }
})

// Get employer's jobs
const employerJobs = computed(() => {
  if (!employer.value) return []
  
  return [...jobStore.jobs, ...jobStore.pendingJobs].filter(job => job.companyId === employer.value?.id)
})

// Sort jobs by date
const sortedJobs = computed(() => {
  return [...employerJobs.value].sort((a, b) => {
    return new Date(b.postedDate).getTime() - new Date(a.postedDate).getTime()
  })
})

// Get applications for a job
function getApplicationsForJob(jobId: string) {
  return appStore.applications.filter(app => app.jobId === jobId)
}

// Format date
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Badge variant based on status
function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-success-100 text-success-800'
    case 'pending':
      return 'bg-warning-100 text-warning-800'
    case 'rejected':
      return 'bg-error-100 text-error-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// Tabs
const activeTab = ref('all')
const tabs = [
  { id: 'all', label: 'All Jobs' },
  { id: 'active', label: 'Active Jobs' },
  { id: 'pending', label: 'Pending Approval' }
]

// Filtered jobs based on active tab
const filteredJobs = computed(() => {
  if (activeTab.value === 'all') {
    return sortedJobs.value
  } else if (activeTab.value === 'active') {
    return sortedJobs.value.filter(job => job.status === 'approved')
  } else if (activeTab.value === 'pending') {
    return sortedJobs.value.filter(job => job.status === 'pending')
  }
  
  return sortedJobs.value
})

// View job details
function viewJob(jobId: string) {
  router.push(`/jobs/${jobId}`)
}

// Post new job
function postNewJob() {
  router.push('/employer/post-job')
}
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div v-if="employer" class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="bg-gray-800 p-6 sm:p-8 text-white">
          <div class="flex flex-col md:flex-row md:items-center">
            <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
              <img 
                :src="employer.logo || ''" 
                :alt="`${employer.companyName} logo`"
                class="w-20 h-20 rounded-lg object-cover bg-white p-1"
              />
            </div>
            <div class="flex-grow">
              <h1 class="text-2xl md:text-3xl font-bold mb-2">{{ employer.companyName }}</h1>
              <p class="text-gray-300 mb-2">{{ employer.industry }} · {{ employer.location }}</p>
              <p class="text-gray-300">{{ employer.email }}</p>
            </div>
            <div class="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
              <button 
                @click="postNewJob"
                class="btn bg-primary-500 hover:bg-primary-600 text-white"
              >
                Post a New Job
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-6 font-medium text-sm border-b-2 transition-colors"
              :class="activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
        
        <div class="p-6">
          <div v-if="filteredJobs.length > 0">
            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Job Title
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Posted Date
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Applications
                    </th>
                    <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr v-for="job in filteredJobs" :key="job.id">
                    <td class="px-6 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-10 w-10">
                          <img 
                            :src="job.logo || ''" 
                            :alt="`${job.company} logo`" 
                            class="h-10 w-10 rounded-lg object-cover"
                          />
                        </div>
                        <div class="ml-4">
                          <div class="text-sm font-medium text-gray-900">{{ job.title }}</div>
                          <div class="text-sm text-gray-500">{{ job.type }} · {{ job.location }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ formatDate(job.postedDate) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap">
                      <span 
                        class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                        :class="getStatusBadgeClass(job.status)"
                      >
                        {{ job.status.charAt(0).toUpperCase() + job.status.slice(1) }}
                      </span>
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {{ getApplicationsForJob(job.id).length }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button 
                        @click="viewJob(job.id)" 
                        class="text-primary-600 hover:text-primary-900 mr-3"
                      >
                        View
                      </button>
                      <button 
                        class="text-gray-600 hover:text-gray-900"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          <div 
            v-else 
            class="text-center py-12"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
            <p class="text-gray-500 max-w-md mx-auto mb-6">
              You haven't posted any jobs yet. Create your first job listing to start receiving applications from qualified candidates.
            </p>
            <button 
              @click="postNewJob"
              class="btn btn-primary"
            >
              Post Your First Job
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>