<template>
  <div class="space-y-6">
    <!-- Page Info -->
    <div class="bg-gradient-to-r from-slate-50 to-slate-100 rounded-lg p-6 border border-slate-200">
      <h2 class="text-2xl font-bold text-slate-900">Settings</h2>
      <p class="text-slate-600 mt-2">Manage system configuration and preferences.</p>
    </div>

    <!-- Settings Sections -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Sidebar Navigation -->
      <div class="space-y-1">
        <button
          v-for="item in settingsSections"
          :key="item.id"
          @click="activeSection = item.id"
          :class="[
            'w-full text-left px-4 py-3 rounded-lg transition',
            activeSection === item.id
              ? 'bg-indigo-50 text-indigo-700 font-semibold border-l-4 border-indigo-600'
              : 'text-slate-700 hover:bg-slate-50'
          ]"
        >
          {{ item.label }}
        </button>
      </div>

      <!-- Settings Content -->
      <div class="lg:col-span-2 bg-white rounded-lg shadow-sm border border-slate-200 p-6">
        <!-- General Settings -->
        <div v-if="activeSection === 'general'" class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-slate-900 mb-4">General Settings</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Organization Name</label>
                <input
                  v-model="settings.organizationName"
                  type="text"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Organization Email</label>
                <input
                  v-model="settings.organizationEmail"
                  type="email"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-slate-700 mb-2">Timezone</label>
                <select
                  v-model="settings.timezone"
                  class="w-full px-3 py-2 border border-slate-300 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 outline-none transition"
                >
                  <option value="UTC">UTC</option>
                  <option value="EST">EST (Eastern)</option>
                  <option value="CST">CST (Central)</option>
                  <option value="MST">MST (Mountain)</option>
                  <option value="PST">PST (Pacific)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <!-- Security Settings -->
        <div v-else-if="activeSection === 'security'" class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-slate-900 mb-4">Security Settings</h3>
            <div class="space-y-4">
              <div class="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="font-medium text-slate-900">Two-Factor Authentication</h4>
                    <p class="text-sm text-slate-600 mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <input type="checkbox" class="rounded border-slate-300 text-indigo-600" />
                </div>
              </div>
              <div class="border border-slate-200 rounded-lg p-4 bg-slate-50">
                <div class="flex items-start justify-between">
                  <div>
                    <h4 class="font-medium text-slate-900">Password Requirements</h4>
                    <p class="text-sm text-slate-600 mt-1">Enforce strong password policies</p>
                  </div>
                  <input type="checkbox" class="rounded border-slate-300 text-indigo-600" checked />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- API Settings -->
        <div v-else-if="activeSection === 'api'" class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-slate-900 mb-4">API Configuration</h3>
            <div class="bg-slate-50 border border-slate-200 rounded-lg p-4 mb-4">
              <p class="text-sm text-slate-600 mb-3">
                <strong>API Base URL:</strong> {{ apiBaseUrl }}
              </p>
              <button
                @click="copyToClipboard(apiBaseUrl)"
                class="px-3 py-1 text-sm bg-white border border-slate-300 text-slate-700 rounded hover:bg-slate-100 transition"
              >
                Copy
              </button>
            </div>
            <div>
              <label class="block text-sm font-medium text-slate-700 mb-2">API Key</label>
              <div class="flex gap-2">
                <input
                  type="password"
                  placeholder="••••••••••••••••"
                  disabled
                  class="flex-1 px-3 py-2 border border-slate-300 rounded-lg bg-slate-100 text-slate-600"
                />
                <button class="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                  Generate
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Notification Settings -->
        <div v-else-if="activeSection === 'notifications'" class="space-y-6">
          <div>
            <h3 class="text-lg font-bold text-slate-900 mb-4">Notification Preferences</h3>
            <div class="space-y-3">
              <div class="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p class="font-medium text-slate-900">Email Notifications</p>
                  <p class="text-xs text-slate-600">Receive email updates about employee changes</p>
                </div>
                <input type="checkbox" class="rounded border-slate-300 text-indigo-600" checked />
              </div>
              <div class="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p class="font-medium text-slate-900">New Hire Alerts</p>
                  <p class="text-xs text-slate-600">Get notified when new employees are added</p>
                </div>
                <input type="checkbox" class="rounded border-slate-300 text-indigo-600" checked />
              </div>
              <div class="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                <div>
                  <p class="font-medium text-slate-900">Weekly Reports</p>
                  <p class="text-xs text-slate-600">Receive weekly summary reports</p>
                </div>
                <input type="checkbox" class="rounded border-slate-300 text-indigo-600" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Save Button -->
    <div class="flex justify-end gap-3">
      <button
        class="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition font-medium"
      >
        Cancel
      </button>
      <button
        @click="saveSettings"
        class="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-medium"
      >
        Save Changes
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const activeSection = ref('general')

const settingsSections = [
  { id: 'general', label: 'General' },
  { id: 'security', label: 'Security' },
  { id: 'api', label: 'API' },
  { id: 'notifications', label: 'Notifications' }
]

const settings = ref({
  organizationName: 'ACME Corporation',
  organizationEmail: 'admin@acme.com',
  timezone: 'UTC'
})

const apiBaseUrl = ref(import.meta.env.VITE_API_URL || 'http://localhost:3000/api')

const saveSettings = () => {
  // Save settings logic here
  alert('Settings saved successfully!')
}

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text)
  alert('Copied to clipboard!')
}
</script>
