<template>
  <div class="space-y-6">
    <!-- Page Info -->
    <div class="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
      <h2 class="text-2xl font-bold text-purple-900">Reports & Analytics</h2>
      <p class="text-purple-700 mt-2">Insights and analytics about your workforce.</p>
    </div>

    <!-- Reports Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Department Distribution -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Employees by Department</h3>
        <div class="space-y-3">
          <div
            v-for="(count, dept) in employeeStore.employeesByDepartment"
            :key="dept"
          >
            <div class="flex justify-between text-sm mb-1">
              <span class="font-medium text-slate-900">{{ dept }}</span>
              <span class="text-slate-600">{{ count }} employees</span>
            </div>
            <div class="w-full bg-slate-200 rounded-full h-2">
              <div
                class="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-full"
                :style="{ width: `${(count / employeeStore.totalEmployees) * 100}%` }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Employee Status Distribution -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Employee Status</h3>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-green-500 rounded-full"></div>
              <span class="text-slate-700">Active</span>
            </div>
            <span class="font-semibold text-slate-900">{{ employeeStore.activeEmployees }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-gray-400 rounded-full"></div>
              <span class="text-slate-700">Inactive</span>
            </div>
            <span class="font-semibold text-slate-900">{{ inactiveCount }}</span>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center space-x-2">
              <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span class="text-slate-700">On Leave</span>
            </div>
            <span class="font-semibold text-slate-900">{{ onLeaveCount }}</span>
          </div>
        </div>
      </div>

      <!-- Hiring Trend -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Hiring Trend (Last 6 Months)</h3>
        <div class="text-center py-8 text-slate-500">
          <p>Histogram data would render here</p>
          <p class="text-xs mt-2">Integration with a charting library recommended</p>
        </div>
      </div>

      <!-- Employee Statistics -->
      <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <h3 class="text-lg font-bold text-slate-900 mb-4">Statistics</h3>
        <div class="space-y-4">
          <div class="flex justify-between items-center border-b border-slate-200 pb-3">
            <span class="text-slate-600">Total Employees</span>
            <span class="text-2xl font-bold text-slate-900">{{ employeeStore.totalEmployees }}</span>
          </div>
          <div class="flex justify-between items-center border-b border-slate-200 pb-3">
            <span class="text-slate-600">Average Tenure</span>
            <span class="text-2xl font-bold text-slate-900">{{ averageTenure }} yrs</span>
          </div>
          <div class="flex justify-between items-center">
            <span class="text-slate-600">Departments</span>
            <span class="text-2xl font-bold text-slate-900">{{ departmentCount }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Export Section -->
    <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
      <h3 class="text-lg font-bold text-slate-900 mb-4">Export Data</h3>
      <div class="flex flex-wrap gap-3">
        <button
          @click="exportCSV"
          class="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
        >
          <Download class="w-4 h-4" />
          <span>Export to CSV</span>
        </button>
        <button
          @click="exportPDF"
          class="flex items-center space-x-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
        >
          <Download class="w-4 h-4" />
          <span>Export to PDF</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useEmployeeStore } from '../stores/employeeStore'
import { Download } from 'lucide-vue3'

const employeeStore = useEmployeeStore()

const inactiveCount = computed(() => {
  return employeeStore.employees.filter(e => e.status === 'inactive').length
})

const onLeaveCount = computed(() => {
  return employeeStore.employees.filter(e => e.status === 'on-leave').length
})

const departmentCount = computed(() => {
  return Object.keys(employeeStore.employeesByDepartment).length
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

const exportCSV = () => {
  const headers = ['Name', 'Email', 'Position', 'Department', 'Join Date', 'Status']
  const rows = employeeStore.employees.map(emp => [
    emp.name,
    emp.email,
    emp.position,
    emp.department,
    emp.joinDate,
    emp.status
  ])

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv' })
  const url = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `employees-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  window.URL.revokeObjectURL(url)
}

const exportPDF = () => {
  alert('PDF export functionality would require a PDF library like jsPDF or pdfkit')
}
</script>
