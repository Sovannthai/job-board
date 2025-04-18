<script setup lang="ts">
import { computed } from 'vue'
import type { Job } from '../../types'

const props = defineProps<{
  job: Job
}>()

const formattedDate = computed(() => {
  const postedDate = new Date(props.job.postedDate)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - postedDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 0) {
    return 'Today'
  } else if (diffDays === 1) {
    return 'Yesterday'
  } else if (diffDays < 7) {
    return `${diffDays} days ago`
  } else if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`
  } else {
    const months = Math.floor(diffDays / 30)
    return `${months} ${months === 1 ? 'month' : 'months'} ago`
  }
})
</script>

<template>
  <router-link :to="`/jobs/${job.id}`" class="block transition-all duration-300 hover:shadow-md rounded-xl h-full">
    <div class="bg-white border border-gray-200 rounded-xl p-6 transition-all duration-300 hover:border-primary-200 h-full flex flex-col">
      <div class="flex items-start gap-4">
        <div class="hidden sm:block flex-shrink-0">
          <div class="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center">
            <img 
              :src="job.logo || ''" 
              :alt="`${job.company} logo`"
              class="w-full h-full object-cover"
              onerror="this.src='https://via.placeholder.com/64?text=Logo'"
            />
          </div>
        </div>
        
        <div class="flex-grow">
          <h3 class="text-xl font-semibold text-gray-900 mb-1 line-clamp-1">{{ job.title }}</h3>
          <p class="text-gray-700 mb-3 font-medium">{{ job.company }}</p>
          
          <div class="flex flex-wrap items-center text-sm text-gray-500 gap-x-4 gap-y-2 mb-3">
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {{ job.location }}
            </div>
            
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              {{ job.type }}
            </div>
            
            <div class="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {{ formattedDate }}
            </div>
          </div>
          
          <div class="text-gray-600 text-sm line-clamp-2 mb-4">
            {{ job.description }}
          </div>
        </div>
        
        <div class="hidden sm:flex flex-shrink-0 ml-2 text-sm font-medium text-primary-600 items-center">
          <span>View Details</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      
      <div class="flex flex-wrap gap-2 mt-4">
        <span 
          v-for="(benefit, index) in job.benefits.slice(0, 3)" 
          :key="index"
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700 border border-primary-100"
        >
          {{ benefit }}
        </span>
        <span 
          v-if="job.benefits.length > 3"
          class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-700 border border-gray-100"
        >
          +{{ job.benefits.length - 3 }} more
        </span>
      </div>
      
      <div class="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center">
        <div class="text-sm font-medium text-gray-500">
          {{ job.salary || 'Salary not disclosed' }}
        </div>
        <span class="sm:hidden inline-flex items-center text-sm font-medium text-primary-600">
          View Details
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </span>
      </div>
    </div>
  </router-link>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>