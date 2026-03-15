<template>
  <div class="space-y-4">
    <!-- Header with Search and Add Button -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="flex-1 w-full sm:w-auto">
        <div class="relative">
          <Search class="absolute left-3 top-3 w-5 h-5 text-slate-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or department..."
            class="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
          />
        </div>
      </div>
      <button
        @click="showAddEmployeeModal = true"
        class="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        <Plus class="w-5 h-5" />
        <span>Add Employee</span>
      </button>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap gap-2">
      <button
        v-for="dept in departments"
        :key="dept"
        @click="selectedDepartment = selectedDepartment === dept ? null : dept"
        :class="[
          'px-3 py-1 rounded-full text-sm font-medium transition',
          selectedDepartment === dept
            ? 'bg-indigo-600 text-white'
            : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
        ]"
      >
        {{ dept }}
      </button>
      <button
        v-if="selectedDepartment"
        @click="selectedDepartment = null"
        class="px-3 py-1 rounded-full text-sm font-medium text-slate-600 hover:text-slate-900"
      >
        Clear filter
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="employeeStore.loading" class="flex justify-center py-12">
      <div class="flex flex-col items-center space-y-4">
        <div class="w-12 h-12 border-4 border-slate-200 border-t-indigo-600 rounded-full animate-spin"></div>
        <p class="text-slate-600">Loading employees...</p>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else-if="filteredEmployees.length === 0" class="flex justify-center py-12">
      <div class="text-center">
        <Users class="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p class="text-slate-600 font-medium">No employees found</p>
        <p class="text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
      </div>
    </div>

    <!-- Table -->
    <div v-else class="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-slate-50 border-b border-slate-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Name</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Email</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Position</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Department</th>
              <th class="px-6 py-3 text-left text-xs font-semibold text-slate-700 uppercase tracking-wide">Status</th>
              <th class="px-6 py-3 text-right text-xs font-semibold text-slate-700 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-200">
            <tr
              v-for="employee in paginatedEmployees"
              :key="employee.id"
              class="hover:bg-slate-50 transition-colors"
            >
              <td class="px-6 py-4">
                <div class="flex items-center space-x-3">
                  <div
                    class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold text-sm"
                  >
                    {{ getInitials(employee.name) }}
                  </div>
                  <span class="font-medium text-slate-900">{{ employee.name }}</span>
                </div>
              </td>
              <td class="px-6 py-4 text-slate-600 text-sm">{{ employee.email }}</td>
              <td class="px-6 py-4 text-slate-600 text-sm">{{ employee.position }}</td>
              <td class="px-6 py-4">
                <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-medium">
                  {{ employee.department }}
                </span>
              </td>
              <td class="px-6 py-4">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    statusBadgeClass(employee.status)
                  ]"
                >
                  {{ statusLabel(employee.status) }}
                </span>
              </td>
              <td class="px-6 py-4 text-right">
                <div class="flex items-center justify-end space-x-2">
                  <button
                    @click="editEmployee(employee)"
                    class="p-2 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit2 class="w-4 h-4" />
                  </button>
                  <button
                    @click="deleteEmployeeConfirm(employee.id)"
                    class="p-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Delete"
                  >
                    <Trash2 class="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div v-if="totalPages > 1" class="px-6 py-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
        <p class="text-sm text-slate-600">
          Showing <span class="font-semibold">{{ startIndex + 1 }}</span> to
          <span class="font-semibold">{{ Math.min(startIndex + pageSize, filteredEmployees.length) }}</span> of
          <span class="font-semibold">{{ filteredEmployees.length }}</span> employees
        </p>
        <div class="flex gap-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Previous
          </button>
          <span class="flex items-center px-3 py-1 text-sm text-slate-700">
            Page {{ currentPage }} of {{ totalPages }}
          </span>
          <button
            @click="currentPage++"
            :disabled="currentPage === totalPages"
            class="px-3 py-1 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Employee Form Modal -->
    <EmployeeFormModal
      v-if="showAddEmployeeModal"
      :employee="editingEmployee"
      @save="saveEmployee"
      @close="showAddEmployeeModal = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useEmployeeStore, type Employee } from '../stores/employeeStore'
import EmployeeFormModal from './EmployeeFormModal.vue'
import { Search, Plus, Edit2, Trash2, Users } from 'lucide-vue3'

const employeeStore = useEmployeeStore()
const searchQuery = ref('')
const selectedDepartment = ref<string | null>(null)
const showAddEmployeeModal = ref(false)
const editingEmployee = ref<Employee | null>(null)
const currentPage = ref(1)
const pageSize = 10

const departments = computed(() => {
  const depts = new Set(employeeStore.employees.map(e => e.department))
  return Array.from(depts).sort()
})

const filteredEmployees = computed(() => {
  let filtered = employeeStore.employees

  if (searchQuery.value) {
    filtered = employeeStore.searchEmployees(searchQuery.value)
  }

  if (selectedDepartment.value) {
    filtered = filtered.filter(e => e.department === selectedDepartment.value)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredEmployees.value.length / pageSize))

const startIndex = computed(() => (currentPage.value - 1) * pageSize)

const paginatedEmployees = computed(() => {
  return filteredEmployees.value.slice(startIndex.value, startIndex.value + pageSize)
})

const getInitials = (name: string) => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

const statusLabel = (status: string) => {
  const labels: Record<string, string> = {
    active: 'Active',
    inactive: 'Inactive',
    'on-leave': 'On Leave'
  }
  return labels[status] || status
}

const statusBadgeClass = (status: string) => {
  const classes: Record<string, string> = {
    active: 'bg-green-100 text-green-800',
    inactive: 'bg-gray-100 text-gray-800',
    'on-leave': 'bg-yellow-100 text-yellow-800'
  }
  return classes[status] || 'bg-slate-100 text-slate-800'
}

const editEmployee = (employee: Employee) => {
  editingEmployee.value = { ...employee }
  showAddEmployeeModal.value = true
}

const saveEmployee = async (employeeData: Omit<Employee, 'id'>) => {
  try {
    if (editingEmployee.value?.id) {
      await employeeStore.updateEmployee(editingEmployee.value.id, employeeData)
    } else {
      await employeeStore.createEmployee(employeeData)
    }
    showAddEmployeeModal.value = false
    editingEmployee.value = null
  } catch (error) {
    console.error('Failed to save employee:', error)
  }
}

const deleteEmployeeConfirm = (id: string) => {
  if (confirm('Are you sure you want to delete this employee?')) {
    employeeStore.deleteEmployee(id)
  }
}
</script>
