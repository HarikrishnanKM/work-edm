<template>
  <div class="space-y-6">
    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <!-- Total Employees Card -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">Total Employees</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">{{ employeeStore.totalEmployees }}</p>
            <p class="text-xs text-slate-500 mt-2">All active and inactive</p>
          </div>
          <div class="p-3 bg-blue-100 rounded-lg">
            <Users class="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <!-- Active Employees Card -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">Active Employees</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">{{ employeeStore.activeEmployees }}</p>
            <p class="text-xs text-green-600 mt-2">
              {{ activePercentage }}% of total
            </p>
          </div>
          <div class="p-3 bg-green-100 rounded-lg">
            <CheckCircle class="w-6 h-6 text-green-600" />
          </div>
        </div>
      </div>

      <!-- Departments Card -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">Departments</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">{{ departmentCount }}</p>
            <p class="text-xs text-slate-500 mt-2">Across organization</p>
          </div>
          <div class="p-3 bg-purple-100 rounded-lg">
            <Briefcase class="w-6 h-6 text-purple-600" />
          </div>
        </div>
      </div>

      <!-- New Hires Card -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-slate-600 text-sm font-medium">New Hires (30 days)</p>
            <p class="text-3xl font-bold text-slate-900 mt-2">{{ newHiresCount }}</p>
            <p class="text-xs text-orange-600 mt-2">Recent additions</p>
          </div>
          <div class="p-3 bg-orange-100 rounded-lg">
            <TrendingUp class="w-6 h-6 text-orange-600" />
          </div>
        </div>
      </div>
    </div>

    <!-- Two Column Layout -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Department Breakdown -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Department Breakdown</h3>
        <div class="space-y-4">
          <div
            v-for="(count, dept) in employeeStore.employeesByDepartment"
            :key="dept"
            class="flex items-center justify-between"
          >
            <div class="flex items-center space-x-3 flex-1">
              <div class="flex-shrink-0">
                <div class="w-2 h-2 bg-indigo-600 rounded-full"></div>
              </div>
              <span class="text-slate-700 font-medium">{{ dept }}</span>
            </div>
            <div class="flex items-center space-x-3">
              <div class="w-24 bg-slate-200 rounded-full h-2">
                <div
                  class="h-full bg-indigo-600 rounded-full"
                  :style="{ width: `${(count / employeeStore.totalEmployees) * 100}%` }"
                ></div>
              </div>
              <span class="text-slate-600 font-semibold text-right min-w-12">{{ count }}</span>
            </div>
          </div>
          <div v-if="Object.keys(employeeStore.employeesByDepartment).length === 0" class="text-center py-8 text-slate-500">
            No department data available
          </div>
        </div>
      </div>

      <!-- Quick Stats -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Quick Stats</h3>
        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-slate-600">Avg. Tenure</span>
            <span class="font-semibold text-slate-900">{{ averageTenure }} years</span>
          </div>
          <div class="border-t border-slate-200 pt-4 flex items-center justify-between">
            <span class="text-slate-600">Newest Hire</span>
            <span class="font-semibold text-slate-900">{{ newestHire }}</span>
          </div>
          <div class="border-t border-slate-200 pt-4 flex items-center justify-between">
            <span class="text-slate-600">Gender Diversity</span>
            <span class="font-semibold text-slate-900">Balanced</span>
          </div>
          <div class="border-t border-slate-200 pt-4">
            <button
              @click="$router.push('/employees')"
              class="w-full px-4 py-2 text-center bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium text-sm"
            >
              View All Employees
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 class="text-lg font-bold text-slate-900 mb-4">Recent Employees</h3>
      <div v-if="recentEmployees.length === 0" class="text-center py-8 text-slate-500">
        No employees yet. Add your first employee to get started.
      </div>
      <div v-else class="space-y-3">
        <div
          v-for="emp in recentEmployees"
          :key="emp.id"
          class="flex items-center justify-between p-3 hover:bg-slate-50 rounded-lg transition"
        >
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm">
              {{ getInitials(emp.name) }}
            </div>
            <div>
              <p class="font-medium text-slate-900">{{ emp.name }}</p>
              <p class="text-xs text-slate-500">{{ emp.position }}</p>
            </div>
          </div>
          <span class="text-xs text-slate-500">{{ formatDate(emp.joinDate) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useEmployeeStore } from '../stores/employeeStore'
import { Users, CheckCircle, Briefcase, TrendingUp } from 'lucide-vue3'

const router = useRouter()
const employeeStore = useEmployeeStore()

onMounted(() => {
  if (employeeStore.employees.length === 0) {
    employeeStore.fetchEmployees().catch(() => {
      // Handle error silently - will show empty state
    })
  }
})

const activePercentage = computed(() => {
  if (employeeStore.totalEmployees === 0) return 0
  return Math.round((employeeStore.activeEmployees / employeeStore.totalEmployees) * 100)
})

const departmentCount = computed(() => {
  return Object.keys(employeeStore.employeesByDepartment).length
})

const newHiresCount = computed(() => {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return employeeStore.employees.filter(emp => {
    const joinDate = new Date(emp.joinDate)
    return joinDate >= thirtyDaysAgo
  }).length
})

const averageTenure = computed(() => {
  if (employeeStore.totalEmployees === 0) return 0

  const totalDays = employeeStore.employees.reduce((sum, emp) => {
    const joinDate = new Date(emp.joinDate)
    const today = new Date()
    const days = Math.floor((today.getTime() - joinDate.getTime()) / (1000 * 60 * 60 * 24))
    return sum + days
  }, 0)

  const avgDays = totalDays / employeeStore.totalEmployees
  return (avgDays / 365).toFixed(1)
})

const newestHire = computed(() => {
  if (employeeStore.employees.length === 0) return 'N/A'
  const newest = [...employeeStore.employees].sort(
    (a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime()
  )[0]
  return formatDate(newest.joinDate)
})

const recentEmployees = computed(() => {
  return [...employeeStore.employees]
    .sort((a, b) => new Date(b.joinDate).getTime() - new Date(a.joinDate).getTime())
    .slice(0, 5)
})

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>
