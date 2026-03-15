<template>
  <Teleport to="body">
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-screen overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-900">
            {{ employee ? 'Edit Employee' : 'Add Employee' }}
          </h2>
          <button
            @click="$emit('close')"
            class="p-1 hover:bg-slate-100 rounded-lg transition"
          >
            <X class="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <!-- Form -->
        <form @submit.prevent="submitForm" class="p-6 space-y-4">
          <!-- Name -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Full Name *</label>
            <input
              v-model="form.name"
              type="text"
              placeholder="John Doe"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
            <span v-if="errors.name" class="text-xs text-red-600 mt-1 block">{{ errors.name }}</span>
          </div>

          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Email Address *</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="john@example.com"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
            <span v-if="errors.email" class="text-xs text-red-600 mt-1 block">{{ errors.email }}</span>
          </div>

          <!-- Position -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Position *</label>
            <input
              v-model="form.position"
              type="text"
              placeholder="Software Engineer"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
            <span v-if="errors.position" class="text-xs text-red-600 mt-1 block">{{ errors.position }}</span>
          </div>

          <!-- Department -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Department *</label>
            <select
              v-model="form.department"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            >
              <option value="">Select Department</option>
              <option value="Engineering">Engineering</option>
              <option value="Sales">Sales</option>
              <option value="Marketing">Marketing</option>
              <option value="HR">HR</option>
              <option value="Finance">Finance</option>
              <option value="Operations">Operations</option>
            </select>
            <span v-if="errors.department" class="text-xs text-red-600 mt-1 block">{{ errors.department }}</span>
          </div>

          <!-- Join Date -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Join Date *</label>
            <input
              v-model="form.joinDate"
              type="date"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            />
            <span v-if="errors.joinDate" class="text-xs text-red-600 mt-1 block">{{ errors.joinDate }}</span>
          </div>

          <!-- Status -->
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-2">Status *</label>
            <select
              v-model="form.status"
              required
              class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on-leave">On Leave</option>
            </select>
            <span v-if="errors.status" class="text-xs text-red-600 mt-1 block">{{ errors.status }}</span>
          </div>

          <!-- Buttons -->
          <div class="flex gap-3 pt-4 border-t border-slate-200">
            <button
              type="button"
              @click="$emit('close')"
              class="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition font-medium"
            >
              {{ isSubmitting ? 'Saving...' : 'Save' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { X } from 'lucide-vue3'
import type { Employee } from '../stores/employeeStore'

interface Props {
  employee?: Employee | null
}

const props = defineProps<Props>()

const emit = defineEmits<{
  save: [employeeData: Omit<Employee, 'id'>]
  close: []
}>()

const isSubmitting = ref(false)
const errors = ref<Record<string, string>>({})

const form = ref<Omit<Employee, 'id'>>({
  name: '',
  email: '',
  position: '',
  department: '',
  joinDate: '',
  status: 'active'
})

watch(
  () => props.employee,
  (newEmployee) => {
    if (newEmployee) {
      form.value = { ...newEmployee }
    } else {
      form.value = {
        name: '',
        email: '',
        position: '',
        department: '',
        joinDate: '',
        status: 'active'
      }
    }
    errors.value = {}
  },
  { immediate: true }
)

const validateForm = () => {
  errors.value = {}

  if (!form.value.name.trim()) {
    errors.value.name = 'Name is required'
  }

  if (!form.value.email.trim()) {
    errors.value.email = 'Email is required'
  } else if (!isValidEmail(form.value.email)) {
    errors.value.email = 'Invalid email format'
  }

  if (!form.value.position.trim()) {
    errors.value.position = 'Position is required'
  }

  if (!form.value.department) {
    errors.value.department = 'Department is required'
  }

  if (!form.value.joinDate) {
    errors.value.joinDate = 'Join date is required'
  }

  return Object.keys(errors.value).length === 0
}

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

const submitForm = async () => {
  if (!validateForm()) return

  isSubmitting.value = true
  try {
    emit('save', form.value)
  } finally {
    isSubmitting.value = false
  }
}
</script>
