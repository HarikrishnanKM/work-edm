<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
    <!-- Mobile Menu Button -->
    <button
      @click="sidebarOpen = !sidebarOpen"
      class="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md hover:bg-slate-50 transition"
    >
      <Menu v-if="!sidebarOpen" class="w-6 h-6 text-slate-700" />
      <X v-else class="w-6 h-6 text-slate-700" />
    </button>

    <div class="flex h-screen">
      <!-- Sidebar -->
      <aside
        :class="[
          'fixed lg:sticky top-0 left-0 w-64 h-screen bg-white shadow-xl z-40 transition-transform duration-300',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        ]"
      >
        <!-- Logo Section -->
        <div class="p-6 border-b border-slate-200">
          <div class="flex items-center space-x-3">
            <div class="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-600 to-indigo-700 flex items-center justify-center">
              <Users class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-lg font-bold text-slate-900">work-edm</h1>
              <p class="text-xs text-slate-500">Employee Management</p>
            </div>
          </div>
        </div>

        <!-- Navigation Menu -->
        <nav class="p-4 space-y-2">
          <RouterLink
            v-for="item in navItems"
            :key="item.path"
            :to="item.path"
            @click="sidebarOpen = false"
            :class="[
              'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200',
              isActive(item.path)
                ? 'bg-indigo-50 text-indigo-700 font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
            ]"
          >
            <component :is="item.icon" class="w-5 h-5 flex-shrink-0" />
            <span>{{ item.label }}</span>
          </RouterLink>
        </nav>

        <!-- Sidebar Footer -->
        <div class="absolute bottom-0 w-full p-4 border-t border-slate-200 bg-slate-50">
          <p class="text-xs text-slate-500 text-center">v1.0.0</p>
        </div>
      </aside>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col lg:ml-0 overflow-hidden">
        <!-- Header -->
        <header class="bg-white shadow-sm border-b border-slate-200">
          <div class="px-6 py-4 flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-bold text-slate-900">{{ currentPageTitle }}</h2>
              <p class="text-sm text-slate-500 mt-1">{{ currentPageSubtitle }}</p>
            </div>

            <!-- User Profile Dropdown -->
            <div class="relative">
              <button
                @click="profileDropdownOpen = !profileDropdownOpen"
                class="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition"
              >
                <div class="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white font-semibold">
                  JD
                </div>
                <div class="text-left hidden sm:block">
                  <p class="text-sm font-medium text-slate-900">John Doe</p>
                  <p class="text-xs text-slate-500">Administrator</p>
                </div>
                <ChevronDown class="w-4 h-4 text-slate-500" />
              </button>

              <!-- Dropdown Menu -->
              <Transition
                enter-active-class="transition duration-150"
                enter-from-class="opacity-0 scale-95"
                enter-to-class="opacity-100 scale-100"
                leave-active-class="transition duration-150"
                leave-from-class="opacity-100 scale-100"
                leave-to-class="opacity-0 scale-95"
              >
                <div
                  v-if="profileDropdownOpen"
                  @click.away="profileDropdownOpen = false"
                  class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden z-10"
                >
                  <RouterLink
                    to="/settings"
                    class="block px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                    @click="profileDropdownOpen = false"
                  >
                    <Settings class="w-4 h-4" />
                    <span>Settings</span>
                  </RouterLink>
                  <button
                    @click="logout"
                    class="w-full text-left px-4 py-2 text-slate-700 hover:bg-slate-50 flex items-center space-x-2 border-t border-slate-200"
                  >
                    <LogOut class="w-4 h-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </Transition>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-auto p-6">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink, RouterView, useRoute } from 'vue-router'
import { Users, BarChart3, Cog, Menu, X, ChevronDown, Settings, LogOut } from 'lucide-vue3'

const sidebarOpen = ref(false)
const profileDropdownOpen = ref(false)
const route = useRoute()

const navItems = [
  { path: '/', label: 'Dashboard', icon: BarChart3 },
  { path: '/employees', label: 'Employees', icon: Users },
  { path: '/reports', label: 'Reports', icon: BarChart3 },
  { path: '/settings', label: 'Settings', icon: Cog }
]

const pageMetadata = {
  '/': { title: 'Dashboard', subtitle: 'Welcome back! Here\'s your HR overview.' },
  '/employees': { title: 'Employee Directory', subtitle: 'Manage and view all employees' },
  '/reports': { title: 'Reports', subtitle: 'Analytics and insights' },
  '/settings': { title: 'Settings', subtitle: 'Manage system settings' }
}

const currentPageTitle = computed(() => {
  return (pageMetadata[route.path as keyof typeof pageMetadata]?.title) || 'Dashboard'
})

const currentPageSubtitle = computed(() => {
  return (pageMetadata[route.path as keyof typeof pageMetadata]?.subtitle) || ''
})

const isActive = (path: string) => {
  return route.path === path
}

const logout = () => {
  console.log('Logging out...')
  profileDropdownOpen.value = false
  // Add actual logout logic here
}
</script>

<style scoped>
/* Smooth transitions */
:deep(.router-view-enter-active),
:deep(.router-view-leave-active) {
  transition: opacity 0.3s ease;
}

:deep(.router-view-enter-from),
:deep(.router-view-leave-to) {
  opacity: 0;
}
</style>
