<script setup lang="ts">
import { ref, watch } from 'vue'
import { useJobStore } from '../../stores/jobStore'
import type { JobFilter } from '../../types'

const jobStore = useJobStore()

const filters = ref<JobFilter>({
  search: jobStore.filters.search || '',
  location: jobStore.filters.location || '',
  type: jobStore.filters.type || '',
})

const jobTypes = [
  { value: '', label: 'All Types' },
  { value: 'Full-time', label: 'Full-time' },
  { value: 'Part-time', label: 'Part-time' },
  { value: 'Contract', label: 'Contract' },
  { value: 'Internship', label: 'Internship' },
  { value: 'Remote', label: 'Remote' },
]

const showFilters = ref(false)

function toggleFilters() {
  showFilters.value = !showFilters.value
}

function applyFilters() {
  jobStore.updateFilters(filters.value)
  showFilters.value = false
}

function resetFilters() {
  filters.value = {
    search: '',
    location: '',
    type: '',
  }
  jobStore.resetFilters()
  showFilters.value = false
}

// Watch for changes in the search field and apply filters after a short delay
let searchTimeout: ReturnType<typeof setTimeout> | null = null
watch(() => filters.value.search, (newValue) => {
  if (searchTimeout) clearTimeout(searchTimeout)
  searchTimeout = setTimeout(() => {
    jobStore.updateFilters({ search: newValue })
  }, 300)
})
</script>

<template>
  <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-5 mb-6">
    <form @submit.prevent="applyFilters">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-grow">
          <label for="search" class="sr-only">Search jobs</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              id="search"
              type="text"
              v-model="filters.search"
              placeholder="Search for jobs, companies, or keywords"
              class="form-input pl-10 py-2.5 rounded-lg w-full"
            />
          </div>
        </div>
        
        <div class="md:w-auto">
          <button
            type="button"
            @click="toggleFilters"
            class="w-full md:w-auto px-4 py-2.5 rounded-lg bg-white border border-gray-300 text-gray-700 font-medium flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            <span>Filters</span>
            <span class="ml-1.5 flex items-center justify-center bg-gray-100 text-xs font-semibold rounded-full h-5 w-5 text-gray-700">
              {{ Object.values(filters).filter(Boolean).length }}
            </span>
          </button>
        </div>
      </div>
      
      <transition
        enter-active-class="transition ease-out duration-200"
        enter-from-class="opacity-0 -translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition ease-in duration-150"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-4"
      >
        <div v-if="showFilters" class="mt-5 pt-5 border-t border-gray-100">
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <div>
              <label for="location" class="form-label">Location</label>
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <input
                  id="location"
                  type="text"
                  v-model="filters.location"
                  placeholder="City, state, or remote"
                  class="form-input pl-10 py-2.5 rounded-lg w-full"
                />
              </div>
            </div>
            
            <div>
              <label for="job-type" class="form-label">Job Type</label>
              <select
                id="job-type"
                v-model="filters.type"
                class="form-select py-2.5 rounded-lg w-full appearance-none"
              >
                <option v-for="type in jobTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>
            
            <div class="md:col-span-2 lg:col-span-1 flex items-end">
              <div class="flex space-x-3 w-full">
                <button 
                  type="submit"
                  class="flex-grow px-4 py-2.5 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Apply Filters
                </button>
                <button 
                  type="button"
                  @click="resetFilters"
                  class="px-4 py-2.5 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      </transition>
    </form>
  </div>
</template>