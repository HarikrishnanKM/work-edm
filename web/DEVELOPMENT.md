# Development Guide - work-edm

## Local Development Setup

### Initial Setup (First Time)

1. **Clone and install**
   ```bash
   git clone <repository-url>
   cd work-edm
   npm install
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env.development
   ```

3. **Update `.env.development` with your API URL**
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

   Open http://localhost:5173 in your browser

### Running with Docker Compose

If you have a mock API server:

```bash
docker-compose up
```

This will start:
- Frontend at http://localhost:8080
- Mock API at http://localhost:3000

## Project Architecture

### Components Layer
Components are reusable UI elements:
- `EmployeeTable.vue` - Table with search, filter, pagination
- `EmployeeFormModal.vue` - Create/edit employee form

### Views Layer
Views are page-level components:
- `DashboardView.vue` - Overview and statistics
- `EmployeeDirectoryView.vue` - Employee management page
- `ReportsView.vue` - Analytics and data export
- `SettingsView.vue` - Configuration page

### State Management (Pinia)
`employeeStore.ts` handles:
- Employee CRUD operations
- Computed statistics
- Search and filtering logic
- API communication

### API Layer
`api/client.ts` configures Axios:
- Base URL from environment
- Request/response interceptors
- Authentication header handling
- Error handling

## Development Workflow

### Adding a New Feature

1. **Create component in `src/components/`**
   ```vue
   <template>
     <div>Your component</div>
   </template>

   <script setup lang="ts">
   // Your component logic
   </script>
   ```

2. **Update store if needed** (`src/stores/employeeStore.ts`)
   ```typescript
   // Add new action
   const newAction = async () => {
     // Logic here
   }
   ```

3. **Create view if it's a page** (`src/views/NewView.vue`)
   ```vue
   <template>
     <div>
       <ComponentName />
     </div>
   </template>

   <script setup lang="ts">
   import ComponentName from '../components/ComponentName.vue'
   </script>
   ```

4. **Add route** (`src/router/index.js`)
   ```javascript
   {
     path: '/new-route',
     name: 'NewRoute',
     component: () => import('../views/NewView.vue'),
     meta: { title: 'Page Title - work-edm' }
   }
   ```

### Adding a New API Endpoint

1. **Update the store** (`src/stores/employeeStore.ts`)
   ```typescript
   const newEndpoint = async () => {
     loading.value = true
     try {
       const response = await apiClient.get('/new-endpoint')
       // Handle response
     } catch (err) {
       error.value = 'Error message'
     } finally {
       loading.value = false
     }
   }
   ```

2. **Expose in store return**
   ```typescript
   return {
     // ... existing exports
     newEndpoint
   }
   ```

3. **Use in component**
   ```vue
   <script setup lang="ts">
   import { useEmployeeStore } from '../stores/employeeStore'

   const store = useEmployeeStore()

   onMounted(() => {
     store.newEndpoint()
   })
   </script>
   ```

## Styling Guidelines

### Using Tailwind CSS

All styling uses Tailwind utility classes:

```vue
<template>
  <div class="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
    <h2 class="text-lg font-bold text-slate-900">Title</h2>
    <p class="text-slate-600 mt-2">Description</p>
  </div>
</template>
```

### Color System

**Primary Colors (Indigo):**
- `indigo-600` - Primary action buttons
- `indigo-50` - Light backgrounds
- `indigo-700` - Hover states

**Semantic Colors:**
- `green-*` - Success/active states
- `red-*` - Danger/delete
- `yellow-*` - Warning
- `blue-*` - Information

**Neutral Colors:**
- `slate-900` - Dark text
- `slate-600` - Secondary text
- `slate-200` - Borders
- `slate-50` - Light backgrounds

### Responsive Design

Use responsive prefixes:
```vue
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  <!-- 1 column on mobile, 2 on tablet, 4 on desktop -->
</div>
```

### Custom Components

Reusable component patterns:

**Button component example:**
```vue
<template>
  <button :class="[baseClass, variantClass]">
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: 'primary' | 'secondary'
}>()

const baseClass = 'px-4 py-2 rounded-lg transition font-medium'
const variantClass = props.variant === 'primary'
  ? 'bg-indigo-600 text-white hover:bg-indigo-700'
  : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
</script>
```

## Testing (Optional Enhancement)

Install testing dependencies:
```bash
npm install -D vitest @vue/test-utils jsdom
```

Example test:
```typescript
// stores/__tests__/employeeStore.spec.ts
import { describe, it, expect } from 'vitest'
import { useEmployeeStore } from '../employeeStore'

describe('EmployeeStore', () => {
  it('filters employees correctly', () => {
    const store = useEmployeeStore()
    const results = store.searchEmployees('john')
    expect(results.length).toBeGreaterThan(0)
  })
})
```

## Performance Tips

### 1. Lazy Load Routes
```javascript
const Dashboard = () => import('../views/DashboardView.vue')
```

### 2. Computed Properties for Filtering
```typescript
const filteredEmployees = computed(() => {
  // This recalculates only when dependencies change
  return employeeStore.employees.filter(...)
})
```

### 3. Avoid Unnecessary Re-renders
```vue
<template v-if="show">
  <!-- Only render when needed -->
</template>
```

### 4. Image Optimization
```vue
<img loading="lazy" :src="url" alt="description" />
```

## Debugging

### Vue DevTools
1. Install [Vue.js devtools](https://devtools.vuejs.org/)
2. Open browser DevTools and find Vue tab
3. Inspect components and state

### Console Logging
```typescript
console.log('Debug:', state)
console.error('Error:', err)
console.table(dataArray)
```

### Network Debugging
1. Open DevTools Network tab
2. Check API requests and responses
3. Verify correct URLs and headers

### Pinia Devtools
Pinia automatically integrates with Vue DevTools for state inspection

## Code Style

### Naming Conventions
- Components: `PascalCase` (EmployeeTable.vue)
- Functions: `camelCase` (fetchEmployees)
- Constants: `UPPER_SNAKE_CASE` (API_BASE_URL)
- Files: `kebab-case` or `PascalCase`

### Vue 3 Composition API Best Practices
```vue
<script setup lang="ts">
// Define props first
interface Props {
  modelValue: string
}
const props = defineProps<Props>()

// Define emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

// Use reactive references
const count = ref(0)

// Computed properties
const doubled = computed(() => count.value * 2)

// Lifecycle hooks
onMounted(() => {
  // Setup
})

// Watch for changes
watch(() => props.modelValue, (newVal) => {
  // React to changes
})
</script>
```

### TypeScript Usage
```typescript
// Define interfaces for data
interface Employee {
  id: string
  name: string
  email: string
}

// Type function parameters and returns
const getName = (emp: Employee): string => {
  return emp.name
}

// Use as const for better type inference
const statuses = ['active', 'inactive', 'on-leave'] as const
type Status = typeof statuses[number]
```

## Common Tasks

### Add a New Department
1. Update the department list in `EmployeeFormModal.vue`
2. No database changes needed (API handles this)

### Change Primary Color
1. Update `indigo-*` colors in `tailwind.config.js`
2. Or use Tailwind's color palette directly

### Extend API Client
```typescript
// In api/client.ts
apiClient.defaults.baseURL = import.meta.env.VITE_API_URL
apiClient.defaults.headers.common['X-Custom-Header'] = 'value'
```

### Add Authentication
```typescript
// In api/client.ts
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
```

## Troubleshooting

### Hot Module Replacement (HMR) not working
```bash
# Clear cache
rm -rf .vite
npm run dev
```

### Module not found errors
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### Type errors in IDE
```bash
# Run type check
npm run type-check

# Update TypeScript
npm install -D typescript@latest
```

### API timeouts
1. Check API URL in `.env.development`
2. Verify API is running
3. Check network connectivity
4. Increase timeout in `api/client.ts`

## Production Build

Before deploying:

```bash
# Build for production
npm run build

# Preview production build locally
npm run preview

# Type check
npm run type-check

# Check bundle size
npm run build -- --stats
```

Review the build output in `dist/` directory.

## Resources

- [Vue.js 3 Docs](https://vuejs.org/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [Vue Router](https://router.vuejs.org/)
- [Axios Documentation](https://axios-http.com/)

---

Happy developing! 🚀
