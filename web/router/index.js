import { createRouter, createWebHistory } from 'vue-router'

// Views
const Dashboard = () => import('../views/DashboardView.vue')
const EmployeeDirectory = () => import('../views/EmployeeDirectoryView.vue')
const Reports = () => import('../views/ReportsView.vue')
const Settings = () => import('../views/SettingsView.vue')

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    meta: { title: 'Dashboard - work-edm' }
  },
  {
    path: '/employees',
    name: 'EmployeeDirectory',
    component: EmployeeDirectory,
    meta: { title: 'Employees - work-edm' }
  },
  {
    path: '/reports',
    name: 'Reports',
    component: Reports,
    meta: { title: 'Reports - work-edm' }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { title: 'Settings - work-edm' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { top: 0 }
    }
  }
})

// Update page title
router.afterEach((to) => {
  document.title = to.meta.title || 'work-edm'
})

export default router
