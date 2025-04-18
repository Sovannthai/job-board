<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useApplicationStore } from '../../stores/applicationStore'
import { useJobStore } from '../../stores/jobStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const appStore = useApplicationStore()
const jobStore = useJobStore()
const router = useRouter()

const isAuthenticated = computed(() => authStore.isAuthenticated())
const userRole = computed(() => authStore.getUserRole())
const candidate = computed(() => authStore.user)

// Check if authorized
onMounted(() => {
  if (!isAuthenticated.value || userRole.value !== 'candidate') {
    router.push('/login')
  }
})

// Get candidate's applications
const candidateApplications = computed(() => {
  if (!candidate.value) return []
  
  return appStore.getCandidateApplications(candidate.value.id)
})

// Sort applications by date
const sortedApplications = computed(() => {
  return [...candidateApplications.value].sort((a, b) => {
    return new Date(b.appliedDate).getTime() - new Date(a.appliedDate).getTime()
  })
})

// Get job details for an application
function getJobForApplication(jobId: string) {
  return jobStore.getJobById(jobId)
}

// Format date
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Status badge variant
function getStatusBadgeClass(status: string) {
  switch (status) {
    case 'approved':
      return 'bg-success-100 text-success-800'
    case 'pending':
      return 'bg-warning-100 text-warning-800'
    case 'rejected':
      return 'bg-error-100 text-error-800'
    case 'reviewed':
      return 'bg-primary-100 text-primary-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

// View job details
function viewJob(jobId: string) {
  router.push(`/jobs/${jobId}`)
}

// Browse jobs
function browseJobs() {
  router.push('/')
}

// Tabs
const activeTab = ref('all')
const tabs = [
  { id: 'all', label: 'All Applications' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' }
]

// Filtered applications based on active tab
const filteredApplications = computed(() => {
  if (activeTab.value === 'all') {
    return sortedApplications.value
  } else {
    return sortedApplications.value.filter(app => app.status === activeTab.value)
  }
})
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div v-if="candidate" class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="bg-gray-800 p-6 sm:p-8 text-white">
          <div class="flex flex-col md:flex-row md:items-center">
            <div class="flex-grow">
              <h1 class="text-2xl md:text-3xl font-bold mb-2">Welcome, {{ candidate.name }}</h1>
              <p class="text-gray-300">Manage your job applications</p>
            </div>
            <div class="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
              <button 
                @click="browseJobs"
                class="btn bg-primary-500 hover:bg-primary-600 text-white"
              >
                Browse Jobs
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
          <div v-if="filteredApplications.length > 0">
            <div class="space-y-6">
              <div 
                v-for="application in filteredApplications" 
                :key="application.id"
                class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <div class="p-6">
                  <div class="flex flex-col md:flex-row md:items-center">
                    <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                      <img 
                        :src="getJobForApplication(application.jobId)?.logo || ''" 
                        :alt="`${getJobForApplication(application.jobId)?.company} logo`"
                        class="w-16 h-16 rounded-lg object-cover"
                      />
                    </div>
                    <div class="flex-grow">
                      <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-2">
                        <h3 class="text-lg font-semibold text-gray-900">{{ getJobForApplication(application.jobId)?.title }}</h3>
                        <span 
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium md:ml-2 mt-1 md:mt-0"
                          :class="getStatusBadgeClass(application.status)"
                        >
                          {{ application.status.charAt(0).toUpperCase() + application.status.slice(1) }}
                        </span>
                      </div>
                      <p class="text-gray-700 mb-2">{{ getJobForApplication(application.jobId)?.company }}</p>
                      
                      <div class="flex flex-wrap text-sm text-gray-500 gap-y-2">
                        <div class="flex items-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {{ getJobForApplication(application.jobId)?.location }}
                        </div>
                        
                        <div class="flex items-center mr-4">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {{ getJobForApplication(application.jobId)?.type }}
                        </div>
                        
                        <div class="flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          Applied: {{ formatDate(application.appliedDate) }}
                        </div>
                      </div>
                    </div>
                    
                    <div class="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
                      <button 
                        @click="viewJob(application.jobId)"
                        class="btn btn-outline w-full sm:w-auto"
                      >
                        View Job
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div 
            v-else 
            class="text-center py-12 bg-gray-50 rounded-lg"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <h3 class="text-xl font-semibold text-gray-700 mb-2">No applications found</h3>
            <p class="text-gray-500 max-w-md mx-auto mb-6">
              You haven't applied to any jobs yet. Browse available jobs and submit your application to get started.
            </p>
            <button 
              @click="browseJobs"
              class="btn btn-primary"
            >
              Browse Available Jobs
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>