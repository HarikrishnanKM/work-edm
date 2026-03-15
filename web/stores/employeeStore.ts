import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import apiClient from '../api/client'

export interface Employee {
  id: string
  name: string
  email: string
  position: string
  department: string
  joinDate: string
  status: 'active' | 'inactive' | 'on-leave'
  avatar?: string
}

export const useEmployeeStore = defineStore('employee', () => {
  const employees = ref<Employee[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const totalEmployees = computed(() => employees.value.length)
  
  const activeEmployees = computed(() => 
    employees.value.filter(e => e.status === 'active').length
  )

  const employeesByDepartment = computed(() => {
    const depts: Record<string, number> = {}
    employees.value.forEach(emp => {
      depts[emp.department] = (depts[emp.department] || 0) + 1
    })
    return depts
  })

  // Actions
  const fetchEmployees = async () => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.get('/employees')
      employees.value = response.data
    } catch (err) {
      error.value = 'Failed to fetch employees'
      console.error(err)
    } finally {
      loading.value = false
    }
  }

  const createEmployee = async (employeeData: Omit<Employee, 'id'>) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.post('/employees', employeeData)
      employees.value.push(response.data)
      return response.data
    } catch (err) {
      error.value = 'Failed to create employee'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const updateEmployee = async (id: string, employeeData: Partial<Employee>) => {
    loading.value = true
    error.value = null
    try {
      const response = await apiClient.put(`/employees/${id}`, employeeData)
      const index = employees.value.findIndex(e => e.id === id)
      if (index !== -1) {
        employees.value[index] = response.data
      }
      return response.data
    } catch (err) {
      error.value = 'Failed to update employee'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const deleteEmployee = async (id: string) => {
    loading.value = true
    error.value = null
    try {
      await apiClient.delete(`/employees/${id}`)
      employees.value = employees.value.filter(e => e.id !== id)
    } catch (err) {
      error.value = 'Failed to delete employee'
      console.error(err)
      throw err
    } finally {
      loading.value = false
    }
  }

  const getEmployeeById = (id: string) => {
    return employees.value.find(e => e.id === id)
  }

  const searchEmployees = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    return employees.value.filter(emp =>
      emp.name.toLowerCase().includes(lowercaseQuery) ||
      emp.email.toLowerCase().includes(lowercaseQuery) ||
      emp.position.toLowerCase().includes(lowercaseQuery) ||
      emp.department.toLowerCase().includes(lowercaseQuery)
    )
  }

  return {
    // State
    employees,
    loading,
    error,
    // Computed
    totalEmployees,
    activeEmployees,
    employeesByDepartment,
    // Actions
    fetchEmployees,
    createEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployeeById,
    searchEmployees
  }
})
