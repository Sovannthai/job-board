<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore } from '../../stores/authStore'
import { useJobStore } from '../../stores/jobStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const jobStore = useJobStore()
const router = useRouter()

// Get jobs and users
const pendingJobs = computed(() => jobStore.pendingJobs)
const approvedJobs = computed(() => jobStore.jobs.filter(job => job.status === 'approved'))
const employers = computed(() => authStore.employers)
const candidates = computed(() => authStore.candidates)

// Format date
function formatDate(dateString: string) {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  return new Date(dateString).toLocaleDateString(undefined, options)
}

// Approve job
function approveJob(jobId: string) {
  jobStore.approveJob(jobId)
}

// Reject job
function rejectJob(jobId: string) {
  jobStore.rejectJob(jobId)
}

// View job details
function viewJobDetails(jobId: string) {
  router.push(`/jobs/${jobId}`)
}

// Tabs
const activeTab = ref('pending')
const tabs = [
  { id: 'pending', label: 'Pending Jobs' },
  { id: 'approved', label: 'Approved Jobs' },
  { id: 'employers', label: 'Employers' },
  { id: 'candidates', label: 'Candidates' }
]
</script>

<template>
  <div class="bg-gray-50 min-h-screen py-8">
    <div class="container mx-auto px-4">
      <div class="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div class="bg-gray-800 p-6 sm:p-8 text-white">
          <h1 class="text-2xl md:text-3xl font-bold mb-2">Admin Dashboard</h1>
          <p class="text-gray-300">Manage job listings, employers, and candidates</p>
        </div>
      </div>
      
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="border-b border-gray-200">
          <nav class="flex overflow-x-auto">
            <button
              v-for="tab in tabs"
              :key="tab.id"
              @click="activeTab = tab.id"
              class="py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap transition-colors"
              :class="activeTab === tab.id ? 'border-primary-500 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-700'"
            >
              {{ tab.label }}
            </button>
          </nav>
        </div>
        
        <div class="p-6">
          <!-- Pending Jobs Tab -->
          <div v-if="activeTab === 'pending'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Jobs Pending Approval</h2>
              <span class="bg-warning-100 text-warning-800 px-3 py-1 rounded-full text-sm font-medium">
                {{ pendingJobs.length }} Pending
              </span>
            </div>
            
            <div v-if="pendingJobs.length > 0">
              <div class="space-y-6">
                <div 
                  v-for="job in pendingJobs" 
                  :key="job.id"
                  class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="p-6">
                    <div class="flex flex-col md:flex-row md:items-center">
                      <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img 
                          :src="job.logo || ''" 
                          :alt="`${job.company} logo`"
                          class="w-16 h-16 rounded-lg object-cover"
                          onerror="this.src='https://via.placeholder.com/64?text=Logo'"
                        />
                      </div>
                      <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ job.title }}</h3>
                        <p class="text-gray-700 mb-2">{{ job.company }}</p>
                        
                        <div class="flex flex-wrap text-sm text-gray-500 gap-y-2">
                          <div class="flex items-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {{ job.location }}
                          </div>
                          
                          <div class="flex items-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {{ job.type }}
                          </div>
                          
                          <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Posted: {{ formatDate(job.postedDate) }}
                          </div>
                        </div>
                      </div>
                      
                      <div class="mt-6 md:mt-0 md:ml-6 flex-shrink-0 flex flex-col sm:flex-row gap-3">
                        <button 
                          @click="viewJobDetails(job.id)"
                          class="btn btn-outline"
                        >
                          View Details
                        </button>
                        <button 
                          @click="approveJob(job.id)"
                          class="btn btn-success"
                        >
                          Approve
                        </button>
                        <button 
                          @click="rejectJob(job.id)"
                          class="btn btn-danger"
                        >
                          Reject
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">No pending jobs</h3>
              <p class="text-gray-500 max-w-md mx-auto">
                There are no jobs waiting for approval at the moment. Check back later or view approved jobs.
              </p>
            </div>
          </div>
          
          <!-- Approved Jobs Tab -->
          <div v-else-if="activeTab === 'approved'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Approved Job Listings</h2>
              <span class="bg-success-100 text-success-800 px-3 py-1 rounded-full text-sm font-medium">
                {{ approvedJobs.length }} Approved
              </span>
            </div>
            
            <div v-if="approvedJobs.length > 0">
              <div class="space-y-6">
                <div 
                  v-for="job in approvedJobs" 
                  :key="job.id"
                  class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div class="p-6">
                    <div class="flex flex-col md:flex-row md:items-center">
                      <div class="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
                        <img 
                          :src="job.logo || ''" 
                          :alt="`${job.company} logo`"
                          class="w-16 h-16 rounded-lg object-cover"
                        />
                      </div>
                      <div class="flex-grow">
                        <h3 class="text-lg font-semibold text-gray-900 mb-1">{{ job.title }}</h3>
                        <p class="text-gray-700 mb-2">{{ job.company }}</p>
                        
                        <div class="flex flex-wrap text-sm text-gray-500 gap-y-2">
                          <div class="flex items-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {{ job.location }}
                          </div>
                          
                          <div class="flex items-center mr-4">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {{ job.type }}
                          </div>
                          
                          <div class="flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Posted: {{ formatDate(job.postedDate) }}
                          </div>
                        </div>
                      </div>
                      
                      <div class="mt-6 md:mt-0 md:ml-6 flex-shrink-0">
                        <button 
                          @click="viewJobDetails(job.id)"
                          class="btn btn-outline"
                        >
                          View Details
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">No approved jobs</h3>
              <p class="text-gray-500 max-w-md mx-auto">
                There are no approved job listings at the moment.
              </p>
            </div>
          </div>
          
          <!-- Employers Tab -->
          <div v-else-if="activeTab === 'employers'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Registered Employers</h2>
              <span class="bg-primary-100 text-primary-800 px-3 py-1 rounded-full text-sm font-medium">
                {{ employers.length }} Total
              </span>
            </div>
            
            <div v-if="employers.length > 0">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Company</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Industry</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="employer in employers" :key="employer.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="flex items-center">
                          <div class="flex-shrink-0 h-10 w-10">
                            <img :src="employer.logo || ''" :alt="`${employer.companyName} logo`" class="h-10 w-10 rounded-full">
                          </div>
                          <div class="ml-4">
                            <div class="text-sm font-medium text-gray-900">{{ employer.companyName }}</div>
                            <div class="text-sm text-gray-500">{{ employer.website }}</div>
                          </div>
                        </div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ employer.email }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ employer.industry }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ employer.companySize }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ employer.location }}</div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div 
              v-else 
              class="text-center py-12 bg-gray-50 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">No employers registered</h3>
              <p class="text-gray-500 max-w-md mx-auto">
                There are no employers registered in the system.
              </p>
            </div>
          </div>
          
          <!-- Candidates Tab -->
          <div v-else-if="activeTab === 'candidates'">
            <div class="flex justify-between items-center mb-6">
              <h2 class="text-xl font-semibold">Registered Candidates</h2>
              <span class="bg-secondary-100 text-secondary-800 px-3 py-1 rounded-full text-sm font-medium">
                {{ candidates.length }} Total
              </span>
            </div>
            
            <div v-if="candidates.length > 0">
              <div class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Skills</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Education</th>
                      <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Experience</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="candidate in candidates" :key="candidate.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm font-medium text-gray-900">{{ candidate.name }}</div>
                      </td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <div class="text-sm text-gray-900">{{ candidate.email }}</div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="flex flex-wrap gap-1">
                          <span 
                            v-for="(skill, index) in candidate.skills" 
                            :key="index"
                            class="px-2 py-1 text-xs font-medium rounded-full bg-primary-100 text-primary-800"
                          >
                            {{ skill }}
                          </span>
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div v-for="(edu, index) in candidate.education" :key="index" class="text-sm text-gray-900 mb-1">
                          {{ edu.degree }} - {{ edu.institution }}
                        </div>
                      </td>
                      <td class="px-6 py-4">
                        <div v-for="(exp, index) in candidate.experience" :key="index" class="text-sm text-gray-900 mb-1">
                          {{ exp.title }} at {{ exp.company }}
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            <div 
              v-else 
              class="text-center py-12 bg-gray-50 rounded-lg"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h3 class="text-xl font-semibold text-gray-700 mb-2">No candidates registered</h3>
              <p class="text-gray-500 max-w-md mx-auto">
                There are no candidates registered in the system.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>