<script setup lang="ts">
import { ref, computed } from 'vue'
import { useJobStore } from '../stores/jobStore'
import JobCard from '../components/jobs/JobCard.vue'
import JobFilters from '../components/jobs/JobFilters.vue'
import { vIntersectionObserver } from '@vueuse/components'
import { useMotion } from '@vueuse/motion'

const jobStore = useJobStore()
const jobs = computed(() => jobStore.filteredJobs)

// Motion API setup
const heroRef = ref(null)
const titleRef = ref(null)
const subtitleRef = ref(null)
const ctaRef = ref(null)

// Set up refs for animation
useMotion(heroRef, {
  initial: {
    opacity: 0,
    y: 20
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 100,
      duration: 700
    }
  }
})

useMotion(titleRef, {
  initial: {
    opacity: 0,
    y: 20
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 300,
      duration: 700
    }
  }
})

useMotion(subtitleRef, {
  initial: {
    opacity: 0,
    y: 20
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 500,
      duration: 700
    }
  }
})

useMotion(ctaRef, {
  initial: {
    opacity: 0,
    y: 20
  },
  enter: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 700,
      duration: 700
    }
  }
})

const jobItemsRef = ref<HTMLElement[]>([])
const setJobItemRef = (el: any, index: number) => {
  if (el) {
    jobItemsRef.value[index] = el
  }
}

// Stats for hero section
const stats = [
  { value: '250+', label: 'Companies' },
  { value: '10,000+', label: 'Jobs Posted' },
  { value: '5M+', label: 'Candidates' },
  { value: '98%', label: 'Satisfaction' }
]
</script>

<template>
  <div>
    <!-- Hero Section -->
    <section class="bg-gradient-to-r from-primary-600 to-primary-900 text-black py-16 md:py-24">
      <div class="container mx-auto px-4 text-center" ref="heroRef">
        <h1 
          class="text-4xl md:text-5xl lg:text-6xl font-bold mb-6" 
          ref="titleRef"
        >
          Find Your Dream Job Today
        </h1>
        <p 
          class="text-xl md:text-2xl max-w-3xl mx-auto mb-10 text-white/90"
          ref="subtitleRef"
        >
          Connect with top employers and discover opportunities that match your skills and career goals.
        </p>
        
        <div class="flex flex-col sm:flex-row justify-center gap-4 mb-12" ref="ctaRef">
          <router-link to="/register" class="btn btn-lg bg-white text-primary-600 hover:bg-white/90">
            Sign Up for Free
          </router-link>
          <router-link to="/#jobs" class="btn btn-lg bg-primary-800/30 hover:bg-primary-800/50 text-white border border-white/30">
            Browse Jobs
          </router-link>
        </div>
        
        <div class="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div 
            v-for="(stat, index) in stats" 
            :key="index" 
            class="p-4 rounded-lg bg-white/10 backdrop-blur-sm"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 800 + (index * 100), duration: 700 } }"
          >
            <div class="text-3xl md:text-4xl font-bold">{{ stat.value }}</div>
            <div class="text-white/80">{{ stat.label }}</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Job Listings Section -->
    <section class="py-12 bg-neutral-50" id="jobs">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-8 text-center">Latest Job Opportunities</h2>
        
        <JobFilters />
        
        <div v-if="jobs.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          <div 
            v-for="(job, index) in jobs" 
            :key="job.id" 
            :ref="el => setJobItemRef(el, index)"
            v-intersection-observer="[
              (entries) => {
                const entry = entries[0]
                if (entry.isIntersecting) {
                  const el = entry.target
                  el.classList.add('animate-in')
                }
              },
              { threshold: 0.2 }
            ]"
            class="job-item opacity-0 translate-y-4 h-full"
          >
            <JobCard :job="job" class="h-full" />
          </div>
        </div>
        
        <div 
          v-else 
          class="text-center py-16 bg-white rounded-lg shadow-sm"
          v-motion
          :initial="{ opacity: 0, scale: 0.95 }"
          :enter="{ opacity: 1, scale: 1, transition: { duration: 500 } }"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
          <p class="text-gray-500 max-w-md mx-auto">
            We couldn't find any jobs matching your search criteria. Try adjusting your filters or check back later for new opportunities.
          </p>
          <button 
            @click="jobStore.resetFilters()"
            class="mt-6 btn btn-primary"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="py-16 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-bold mb-12 text-center">Why Choose JobBoard</h2>
        
        <div class="grid md:grid-cols-3 gap-8">
          <div 
            class="p-6 rounded-xl bg-gray-50 border border-gray-100"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 100, duration: 700 } }"
          >
            <div class="w-12 h-12 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Top Quality Jobs</h3>
            <p class="text-gray-600">
              We carefully review all job listings to ensure they meet our quality standards. Find opportunities at leading companies across various industries.
            </p>
          </div>
          
          <div 
            class="p-6 rounded-xl bg-gray-50 border border-gray-100"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 300, duration: 700 } }"
          >
            <div class="w-12 h-12 bg-secondary-100 text-secondary-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Easy Application</h3>
            <p class="text-gray-600">
              Apply to jobs with just a few clicks. Our streamlined application process helps you submit your applications quickly and efficiently.
            </p>
          </div>
          
          <div 
            class="p-6 rounded-xl bg-gray-50 border border-gray-100"
            v-motion
            :initial="{ opacity: 0, y: 20 }"
            :enter="{ opacity: 1, y: 0, transition: { delay: 500, duration: 700 } }"
          >
            <div class="w-12 h-12 bg-accent-100 text-accent-600 rounded-lg flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">Verified Employers</h3>
            <p class="text-gray-600">
              All employers on our platform undergo a verification process to ensure legitimacy. Apply with confidence knowing the opportunities are real.
            </p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="py-16 bg-gradient-to-r from-accent-500 to-accent-700 text-white">
      <div 
        class="container mx-auto px-4 text-center"
        v-motion
        :initial="{ opacity: 0, y: 20 }"
        :enter="{ opacity: 1, y: 0, transition: { duration: 700 } }"
      >
        <h2 class="text-3xl font-bold mb-4">Ready to Find Your Next Opportunity?</h2>
        <p class="text-xl max-w-3xl mx-auto mb-8 text-white/90">
          Create an account today and start applying to jobs that match your skills and career goals.
        </p>
        <div class="flex flex-col sm:flex-row justify-center gap-4">
          <router-link to="/register" class="btn btn-lg bg-white text-accent-600 hover:bg-white/90">
            Create an Account
          </router-link>
          <router-link to="/login" class="btn btn-lg bg-accent-800/30 hover:bg-accent-800/50 text-white border border-white/30">
            Sign In
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
.job-item {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.job-item.animate-in {
  opacity: 1;
  transform: translateY(0);
}
</style>