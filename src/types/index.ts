export interface User {
  id: string
  name: string
  email: string
  role: 'employer' | 'candidate' | 'admin'
}

export interface Employer extends User {
  companyName: string
  companySize: string
  industry: string
  logo: string | null
  website: string
  about: string
  location: string
  role: 'employer'
}

export interface Education {
  degree: string
  institution: string
  year: string
}

export interface Experience {
  title: string
  company: string
  location: string
  startDate: string
  endDate: string | 'Present'
  description: string
}

export interface Candidate extends User {
  resume: string | null
  skills: string[]
  education: Education[]
  experience: Experience[]
  role: 'candidate'
}

export interface Job {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary: string
  description: string
  requirements: string[]
  responsibilities: string[]
  benefits: string[]
  postedDate: string
  deadline: string
  logo: string | null
  status: 'pending' | 'approved' | 'rejected'
  companyId: string
}

export interface Application {
  id: string
  jobId: string
  candidateId: string
  status: 'pending' | 'reviewed' | 'approved' | 'rejected'
  coverLetter: string
  appliedDate: string
  resumeUrl: string | null
}

export interface JobFilter {
  search: string
  location: string
  type: string
}

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  duration?: number
}