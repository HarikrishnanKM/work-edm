<template>
  <div class="space-y-6">
    <!-- Page Info -->
    <div class="bg-gradient-to-r from-indigo-50 to-indigo-100 rounded-lg p-6 border border-indigo-200">
      <h2 class="text-2xl font-bold text-indigo-900">Employee Directory</h2>
      <p class="text-indigo-700 mt-2">Manage and organize all employee information in one centralized location.</p>
    </div>

    <!-- Employee Table -->
    <EmployeeTable />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useEmployeeStore } from '../stores/employeeStore'
import EmployeeTable from '../components/EmployeeTable.vue'

const employeeStore = useEmployeeStore()

onMounted(() => {
  if (employeeStore.employees.length === 0) {
    employeeStore.fetchEmployees().catch(() => {
      // Handle error - component will show empty state
    })
  }
})
</script>
