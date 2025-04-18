import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomePage from '../views/HomePage.vue'
import JobDetailsPage from '../views/JobDetailsPage.vue'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import EmployerDashboard from '../views/employer/EmployerDashboard.vue'
import PostJobPage from '../views/employer/PostJobPage.vue'
import AdminDashboard from '../views/admin/AdminDashboard.vue'
import CandidateDashboard from '../views/candidate/CandidateDashboard.vue'
import ApplicationForm from '../views/candidate/ApplicationForm.vue'
import { useAuthStore } from '../stores/authStore'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomePage
  },
  {
    path: '/jobs/:id',
    name: 'job-details',
    component: JobDetailsPage,
    props: true
  },
  {
    path: '/login',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterPage
  },
  {
    path: '/employer',
    name: 'employer-dashboard',
    component: EmployerDashboard,
    meta: {
      requiresAuth: true,
      role: 'employer'
    }
  },
  {
    path: '/employer/post-job',
    name: 'post-job',
    component: PostJobPage,
    meta: {
      requiresAuth: true,
      role: 'employer'
    }
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: AdminDashboard,
    meta: {
      requiresAuth: true,
      role: 'admin'
    }
  },
  {
    path: '/candidate',
    name: 'candidate-dashboard',
    component: CandidateDashboard,
    meta: {
      requiresAuth: true,
      role: 'candidate'
    }
  },
  {
    path: '/jobs/:id/apply',
    name: 'apply-job',
    component: ApplicationForm,
    props: true,
    meta: {
      requiresAuth: true,
      role: 'candidate'
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(_, __, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Navigation guards
router.beforeEach((to, _, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
  const requiredRole = to.matched.find(record => record.meta.role)?.meta.role as string | undefined
  
  if (requiresAuth && !authStore.isAuthenticated()) {
    // User is not authenticated, redirect to login
    next({ name: 'login' })
  } else if (requiresAuth && requiredRole && authStore.getUserRole() !== requiredRole) {
    // User doesn't have the required role, redirect to home
    next({ name: 'home' })
  } else {
    // Allow navigation
    next()
  }
})

export default router