import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Job, JobFilter } from '../types'

export const useJobStore = defineStore('jobs', () => {
  const jobs = ref<Job[]>([
    {
      id: '1',
      title: 'Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$90,000 - $120,000',
      description: 'We are looking for a skilled Frontend Developer to join our team. The ideal candidate should have experience with modern JavaScript frameworks, particularly Vue.js or React.',
      requirements: [
        'At least 3 years of experience with frontend development',
        'Proficiency with Vue.js or React',
        'Knowledge of modern CSS practices',
        'Experience with responsive design',
        'Understanding of version control systems like Git'
      ],
      responsibilities: [
        'Develop new user-facing features',
        'Build reusable components and libraries for future use',
        'Optimize application for maximum speed and scalability',
        'Assure that all user input is validated before submitting to back-end',
        'Collaborate with other team members and stakeholders'
      ],
      benefits: [
        'Competitive salary',
        'Health insurance',
        'Remote work option',
        'Flexible hours',
        'Professional development budget'
      ],
      postedDate: '2025-06-01',
      deadline: '2025-07-15',
      logo: 'https://placehold.co/300x300/0A84FF/FFFFFF.png?text=TC',
      status: 'approved',
      companyId: '1'
    },
    {
      id: '2',
      title: 'UX/UI Designer',
      company: 'DesignHub',
      location: 'Remote',
      type: 'Contract',
      salary: '$70 - $90 per hour',
      description: 'DesignHub is looking for a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have a portfolio of professional design projects and excellent visual design skills.',
      requirements: [
        'At least 2 years of UX/UI design experience',
        'Proficiency with design tools like Figma and Adobe XD',
        'Understanding of user-centered design principles',
        'Experience conducting user research and usability testing',
        'Excellent communication skills'
      ],
      responsibilities: [
        'Create user flows, wireframes, prototypes, and mockups',
        'Develop UI mockups and prototypes that clearly illustrate how sites function and look',
        'Present and defend designs and key deliverables to peers and executive level stakeholders',
        'Conduct user research and evaluate user feedback',
        'Incorporate feedback into design'
      ],
      benefits: [
        'Flexible schedule',
        'Remote work',
        'Project bonuses',
        'Professional development opportunities',
        'Global team environment'
      ],
      postedDate: '2025-06-03',
      deadline: '2025-07-10',
      logo: 'https://placehold.co/300x300/30B0C7/FFFFFF.png?text=DH',
      status: 'approved',
      companyId: '2'
    },
    {
      id: '3',
      title: 'Full Stack Developer',
      company: 'Innovative Systems Ltd',
      location: 'New York, NY',
      type: 'Full-time',
      salary: '$110,000 - $140,000',
      description: 'We are seeking a Full Stack Developer to join our team. You will be responsible for developing and maintaining web applications using various technologies.',
      requirements: [
        'At least 4 years of full stack development experience',
        'Proficiency with JavaScript/TypeScript, Vue.js, Node.js',
        'Experience with SQL and NoSQL databases',
        'Knowledge of cloud services (AWS, Azure, or GCP)',
        'Understanding of DevOps principles'
      ],
      responsibilities: [
        'Design and implement web applications',
        'Write clean, maintainable, and efficient code',
        'Collaborate with cross-functional teams',
        'Troubleshoot and debug applications',
        'Stay updated with emerging technologies'
      ],
      benefits: [
        'Competitive salary',
        'Health and dental insurance',
        '401(k) matching',
        'Flexible work arrangements',
        'Continuous learning opportunities'
      ],
      postedDate: '2025-06-05',
      deadline: '2025-07-20',
      logo: 'https://placehold.co/300x300/5E5CE6/FFFFFF.png?text=IS',
      status: 'pending',
      companyId: '3'
    },
    {
      id: '4',
      title: 'DevOps Engineer',
      company: 'CloudTech Solutions',
      location: 'Austin, TX',
      type: 'Full-time',
      salary: '$100,000 - $130,000',
      description: 'CloudTech Solutions is looking for a DevOps Engineer to help automate and streamline our operations and processes. The ideal candidate will have strong problem-solving skills and experience with cloud platforms.',
      requirements: [
        'At least 3 years of experience in DevOps',
        'Experience with CI/CD pipelines',
        'Knowledge of containerization technologies like Docker and Kubernetes',
        'Experience with Infrastructure as Code tools like Terraform',
        'Cloud platform experience (AWS, Azure, or GCP)'
      ],
      responsibilities: [
        'Implement and maintain CI/CD pipelines',
        'Manage and automate infrastructure',
        'Improve system monitoring and alerting',
        'Collaborate with development teams to improve deployment processes',
        'Troubleshoot and resolve system issues'
      ],
      benefits: [
        'Competitive salary',
        'Comprehensive health benefits',
        'Remote work option',
        'Professional development allowance',
        'Flexible work hours'
      ],
      postedDate: '2025-06-02',
      deadline: '2025-07-15',
      logo: 'https://placehold.co/300x300/34C759/FFFFFF.png?text=CT',
      status: 'approved',
      companyId: '4'
    }
  ])

  const pendingJobs = ref<Job[]>([
    {
      id: '5',
      title: 'Product Manager',
      company: 'InnovateCorp',
      location: 'Boston, MA',
      type: 'Full-time',
      salary: '$110,000 - $150,000',
      description: 'We are looking for an experienced Product Manager to join our team. You will be responsible for guiding the success of our products and leading cross-functional teams.',
      requirements: [
        'At least 5 years of product management experience',
        'Experience with agile methodologies',
        'Strong analytical and problem-solving skills',
        'Excellent communication and leadership abilities',
        'Technical background preferred'
      ],
      responsibilities: [
        'Define product vision, strategy, and roadmap',
        'Conduct market research and user interviews',
        'Collaborate with engineering, design, and marketing teams',
        'Prioritize features and requirements',
        'Track and measure product metrics'
      ],
      benefits: [
        'Competitive salary',
        'Stock options',
        'Health and wellness benefits',
        'Flexible work arrangements',
        'Professional development budget'
      ],
      postedDate: '2025-06-08',
      deadline: '2025-07-25',
      logo: 'https://placehold.co/300x300/FF9500/FFFFFF.png?text=IC',
      status: 'pending',
      companyId: '5'
    },
    {
      id: '6',
      title: 'Data Scientist',
      company: 'DataDriven Inc.',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$120,000 - $160,000',
      description: 'We are seeking a talented Data Scientist to join our growing team. The successful candidate will analyze complex data sets and develop predictive models to help drive business decisions.',
      requirements: [
        'Master\'s or PhD in Data Science, Computer Science, Statistics, or related field',
        'Experience with statistical analysis and machine learning',
        'Proficiency in Python, R, or similar programming languages',
        'Experience with data visualization tools',
        'Strong communication skills'
      ],
      responsibilities: [
        'Analyze large data sets to identify patterns and insights',
        'Develop and implement machine learning models',
        'Communicate findings to technical and non-technical stakeholders',
        'Collaborate with cross-functional teams',
        'Stay current with industry trends and advances'
      ],
      benefits: [
        'Competitive salary',
        'Comprehensive health benefits',
        'Flexible work schedule',
        'Continuous learning opportunities',
        'Relocation assistance'
      ],
      postedDate: '2025-06-07',
      deadline: '2025-07-30',
      logo: 'https://placehold.co/300x300/5E5CE6/FFFFFF.png?text=DD',
      status: 'pending',
      companyId: '6'
    }
  ])

  const filters = ref<JobFilter>({
    search: '',
    location: '',
    type: '',
  })

  const filteredJobs = computed(() => {
    return jobs.value.filter(job => {
      // Only show approved jobs
      if (job.status !== 'approved') return false

      // Filter by search term
      if (filters.value.search && !job.title.toLowerCase().includes(filters.value.search.toLowerCase()) &&
          !job.company.toLowerCase().includes(filters.value.search.toLowerCase()) &&
          !job.description.toLowerCase().includes(filters.value.search.toLowerCase())) {
        return false
      }

      // Filter by location
      if (filters.value.location && !job.location.toLowerCase().includes(filters.value.location.toLowerCase())) {
        return false
      }

      // Filter by job type
      if (filters.value.type && job.type !== filters.value.type) {
        return false
      }

      return true
    })
  })

  function approveJob(jobId: string) {
    const jobIndex = pendingJobs.value.findIndex(job => job.id === jobId)
    if (jobIndex !== -1) {
      const job = pendingJobs.value[jobIndex]
      job.status = 'approved'
      jobs.value.push(job)
      pendingJobs.value.splice(jobIndex, 1)
    }
  }

  function rejectJob(jobId: string) {
    const jobIndex = pendingJobs.value.findIndex(job => job.id === jobId)
    if (jobIndex !== -1) {
      pendingJobs.value.splice(jobIndex, 1)
    }
  }

  function addJob(job: Omit<Job, 'id' | 'status'>) {
    const newJob: Job = {
      ...job,
      id: String(jobs.value.length + pendingJobs.value.length + 1),
      status: 'pending',
      postedDate: new Date().toISOString().split('T')[0]
    }
    pendingJobs.value.push(newJob)
    return newJob
  }

  function getJobById(id: string): Job | undefined {
    return [...jobs.value, ...pendingJobs.value].find(job => job.id === id)
  }

  function updateFilters(newFilters: Partial<JobFilter>) {
    filters.value = { ...filters.value, ...newFilters }
  }

  function resetFilters() {
    filters.value = {
      search: '',
      location: '',
      type: '',
    }
  }

  return {
    jobs,
    pendingJobs,
    filteredJobs,
    filters,
    approveJob,
    rejectJob,
    addJob,
    getJobById,
    updateFilters,
    resetFilters
  }
})