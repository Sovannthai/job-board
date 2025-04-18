import { defineStore } from 'pinia'
import { ref, onMounted } from 'vue'
import type { User, Employer, Candidate } from '../types'

// Admin user type
interface Admin extends User {
  role: 'admin';
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const employers = ref<Employer[]>([
    {
      id: '1',
      name: 'TechCorp Inc.',
      email: 'hr@techcorp.com',
      companyName: 'TechCorp Inc.',
      companySize: '501-1000',
      industry: 'Technology',
      logo: 'https://placehold.co/300x300/0A84FF/FFFFFF.png?text=TC',
      website: 'https://techcorp.example.com',
      about: 'TechCorp is a leading technology company specializing in innovative software solutions.',
      location: 'San Francisco, CA',
      role: 'employer'
    },
    {
      id: '2',
      name: 'DesignHub',
      email: 'jobs@designhub.com',
      companyName: 'DesignHub',
      companySize: '51-200',
      industry: 'Design',
      logo: 'https://placehold.co/300x300/30B0C7/FFFFFF.png?text=DH',
      website: 'https://designhub.example.com',
      about: 'DesignHub is a creative design agency delivering exceptional user experiences.',
      location: 'Remote',
      role: 'employer'
    }
  ])
  
  const candidates = ref<Candidate[]>([
    {
      id: '1',
      name: 'Jane Smith',
      email: 'jane.smith@example.com',
      resume: null,
      skills: ['JavaScript', 'Vue.js', 'CSS', 'HTML'],
      education: [
        {
          degree: 'Bachelor of Science in Computer Science',
          institution: 'University of Technology',
          year: '2022'
        }
      ],
      experience: [
        {
          title: 'Junior Developer',
          company: 'WebTech Solutions',
          location: 'Remote',
          startDate: '2022-06',
          endDate: 'Present',
          description: 'Developing web applications using Vue.js and Node.js.'
        }
      ],
      role: 'candidate'
    }
  ])
  
  const adminUsers = ref<Admin[]>([
    {
      id: 'admin1',
      name: 'Admin User',
      email: 'admin@jobboard.com',
      role: 'admin'
    }
  ])

  // Initialize with admin user logged in by default
  onMounted(() => {
    // Set default admin user
    user.value = adminUsers.value[0];
  })
  
  function login(email: string, role: 'employer' | 'candidate' | 'admin') {
    if (role === 'employer') {
      const employer = employers.value.find(emp => emp.email === email)
      if (employer) {
        user.value = employer
        return true
      }
    } else if (role === 'candidate') {
      const candidate = candidates.value.find(cand => cand.email === email)
      if (candidate) {
        user.value = candidate
        return true
      }
    } else if (role === 'admin') {
      const admin = adminUsers.value.find(adm => adm.email === email)
      if (admin) {
        user.value = admin
        return true
      }
    }
    return false
  }

  function logout() {
    // Set back to default admin instead of null
    user.value = adminUsers.value[0];
  }

  function register(userData: Partial<User>, role: 'employer' | 'candidate') {
    if (role === 'employer') {
      const newEmployer: Employer = {
        id: String(employers.value.length + 1),
        name: userData.name || '',
        email: userData.email || '',
        companyName: (userData as Partial<Employer>).companyName || '',
        companySize: (userData as Partial<Employer>).companySize || '',
        industry: (userData as Partial<Employer>).industry || '',
        logo: 'https://placehold.co/300x300/0A84FF/FFFFFF.png?text=NEW',
        website: (userData as Partial<Employer>).website || '',
        about: (userData as Partial<Employer>).about || '',
        location: (userData as Partial<Employer>).location || '',
        role: 'employer'
      }
      employers.value.push(newEmployer)
      user.value = newEmployer
    } else if (role === 'candidate') {
      const newCandidate: Candidate = {
        id: String(candidates.value.length + 1),
        name: userData.name || '',
        email: userData.email || '',
        resume: null,
        skills: [],
        education: [],
        experience: [],
        role: 'candidate'
      }
      candidates.value.push(newCandidate)
      user.value = newCandidate
    }
    return true
  }

  function isAuthenticated() {
    return !!user.value
  }

  function getUserRole() {
    return user.value?.role
  }

  return {
    user,
    login,
    logout,
    register,
    isAuthenticated,
    getUserRole,
    employers,
    candidates,
    adminUsers
  }
})