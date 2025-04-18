import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Application } from '../types'

export const useApplicationStore = defineStore('applications', () => {
  const applications = ref<Application[]>([
    {
      id: '1',
      jobId: '1',
      candidateId: '1',
      status: 'pending',
      coverLetter: 'I am excited to apply for this position as I have extensive experience in frontend development using Vue.js.',
      appliedDate: '2025-06-02',
      resumeUrl: null
    }
  ])

  function submitApplication(application: Omit<Application, 'id' | 'status' | 'appliedDate'>) {
    const newApplication: Application = {
      ...application,
      id: String(applications.value.length + 1),
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    }
    applications.value.push(newApplication)
    return newApplication
  }

  function getCandidateApplications(candidateId: string) {
    return applications.value.filter(app => app.candidateId === candidateId)
  }

  function getJobApplications(jobId: string) {
    return applications.value.filter(app => app.jobId === jobId)
  }

  function updateApplicationStatus(applicationId: string, status: 'pending' | 'reviewed' | 'approved' | 'rejected') {
    const application = applications.value.find(app => app.id === applicationId)
    if (application) {
      application.status = status
    }
  }

  return {
    applications,
    submitApplication,
    getCandidateApplications,
    getJobApplications,
    updateApplicationStatus
  }
})