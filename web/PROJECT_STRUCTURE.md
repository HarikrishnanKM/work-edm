# work-edm Project Structure & File Reference

## 📦 Project Overview

A production-ready Employee Data Management (EDM) Single Page Application built with Vue.js 3, Vite, and Tailwind CSS. Designed for Azure Container Apps deployment with multi-stage Docker optimization.

## 📁 Complete Directory Structure

```
work-edm/
├── src/                              # Source code
│   ├── components/
│   │   ├── EmployeeTable.vue         # Table with search/filter/pagination
│   │   └── EmployeeFormModal.vue     # Create/edit employee form
│   ├── views/
│   │   ├── DashboardView.vue         # Overview & statistics
│   │   ├── EmployeeDirectoryView.vue # Employee management
│   │   ├── ReportsView.vue           # Analytics & exports
│   │   └── SettingsView.vue          # Configuration
│   ├── stores/
│   │   └── employeeStore.ts          # Pinia state management
│   ├── router/
│   │   └── index.js                  # Vue Router configuration
│   ├── api/
│   │   └── client.ts                 # Axios HTTP client
│   ├── App.vue                       # Root component (layout)
│   ├── main.js                       # App entry point
│   └── style.css                     # Global styles
│
├── public/                           # Static assets
│
├── .github/
│   └── workflows/
│       └── deploy.yml                # GitHub Actions CI/CD
│
├── Configuration Files
│   ├── Dockerfile                    # Multi-stage production build
│   ├── docker-compose.yml            # Local development
│   ├── nginx.conf                    # Nginx main config
│   ├── default.conf                  # Nginx server config
│   ├── vite.config.js                # Vite bundler config
│   ├── tailwind.config.js            # Tailwind CSS config
│   ├── postcss.config.js             # PostCSS config
│   ├── tsconfig.json                 # TypeScript config
│   ├── tsconfig.node.json            # TypeScript build tools
│   ├── package.json                  # Dependencies & scripts
│   ├── index.html                    # HTML entry point
│   │
│   ├── .env.example                  # Environment template
│   ├── .env.development              # Dev environment
│   ├── .env.production               # Prod environment
│   │
│   ├── .gitignore                    # Git ignore patterns
│   └── .dockerignore                 # Docker ignore patterns
│
└── Documentation
    ├── README.md                     # Main documentation
    ├── DEVELOPMENT.md                # Development guide
    └── AZURE_DEPLOYMENT.md           # Azure deployment guide
```

## 🔑 Key Files Reference

### Core Application Files

| File | Purpose | Key Content |
|------|---------|-------------|
| `App.vue` | Root component & layout | Sidebar, header, main router view |
| `main.js` | Application entry point | Vite, Pinia, Router initialization |
| `style.css` | Global styles | Tailwind imports, custom utilities |
| `index.html` | HTML entry point | Meta tags, #app div mount point |

### Components

| File | Purpose | Features |
|------|---------|----------|
| `EmployeeTable.vue` | Employee listing | Search, filter, pagination, CRUD |
| `EmployeeFormModal.vue` | Employee form | Create/edit, validation, modal |

### Views (Pages)

| File | Purpose | Content |
|------|---------|---------|
| `DashboardView.vue` | Homepage | Stats cards, charts, recent hires |
| `EmployeeDirectoryView.vue` | Employee management | Table component |
| `ReportsView.vue` | Analytics page | Department breakdown, CSV export |
| `SettingsView.vue` | Configuration | General, security, API, notifications |

### State & API

| File | Purpose | Exports |
|------|---------|---------|
| `employeeStore.ts` | Pinia store | CRUD actions, computed stats, search |
| `client.ts` | Axios instance | HTTP client with interceptors |
| `index.js` | Vue Router | Route definitions, page metadata |

### Configuration

| File | Purpose | Key Settings |
|------|---------|--------------|
| `Dockerfile` | Container build | Multi-stage, Alpine, Nginx |
| `nginx.conf` | Nginx main | Worker processes, gzip, security |
| `default.conf` | Nginx server | SPA routing, security headers, caching |
| `vite.config.js` | Build config | Dev server, build optimizations |
| `tailwind.config.js` | CSS framework | Custom colors, shadows, fonts |
| `tsconfig.json` | TypeScript | Strict mode, path aliases |
| `package.json` | Dependencies | Vue 3, Pinia, Axios, Tailwind |

### Environment & CI/CD

| File | Purpose | Variables |
|------|---------|-----------|
| `.env.example` | Template | VITE_API_URL template |
| `.env.development` | Dev vars | Local API URL |
| `.env.production` | Prod vars | Relative API path |
| `deploy.yml` | GitHub Actions | Build, test, deploy pipeline |

## 🚀 Feature Matrix

### Dashboard View (`DashboardView.vue`)
- ✅ Total employee count card
- ✅ Active employee statistics
- ✅ Department breakdown with progress bars
- ✅ New hires in last 30 days
- ✅ Average tenure calculation
- ✅ Recent employee list
- ✅ Quick stats widget

### Employee Directory (`EmployeeDirectoryView.vue`)
- ✅ Searchable employee table
- ✅ Department filter buttons
- ✅ Pagination (10 per page)
- ✅ Employee avatar/initials
- ✅ Status badges (Active/Inactive/On Leave)
- ✅ Add employee button
- ✅ Edit/delete actions per row
- ✅ Loading and empty states

### Employee Form Modal (`EmployeeFormModal.vue`)
- ✅ Create new employee
- ✅ Edit existing employee
- ✅ Fields: Name, Email, Position, Department, Join Date, Status
- ✅ Form validation
- ✅ Error messages
- ✅ Submit button with loading state
- ✅ Modal overlay with close button

### Reports View (`ReportsView.vue`)
- ✅ Department distribution chart
- ✅ Employee status breakdown
- ✅ Hiring trend section
- ✅ Statistics summary
- ✅ CSV export functionality
- ✅ PDF export (integration ready)

### Settings View (`SettingsView.vue`)
- ✅ General settings (org name, email, timezone)
- ✅ Security settings
- ✅ API configuration display
- ✅ Notification preferences
- ✅ Tabbed interface

### Layout & Navigation (`App.vue`)
- ✅ Responsive sidebar (collapsible on mobile)
- ✅ Fixed header with page title
- ✅ User profile dropdown
- ✅ Navigation menu with icons
- ✅ Logo/branding section
- ✅ Mobile hamburger menu

## 📊 Component Hierarchy

```
App (Root)
├── Sidebar (Navigation)
│   ├── Logo
│   └── Nav Items (Dashboard, Employees, Reports, Settings)
├── Header
│   ├── Page Title
│   └── User Profile Dropdown
└── Main Content (Router View)
    ├── DashboardView
    │   ├── Stats Cards
    │   ├── Department Breakdown
    │   └── Recent Employees
    ├── EmployeeDirectoryView
    │   └── EmployeeTable
    │       ├── Search/Filter
    │       └── Employee Form Modal
    ├── ReportsView
    │   ├── Charts
    │   ├── Statistics
    │   └── Export Buttons
    └── SettingsView
        └── Settings Sections
```

## 🔄 Data Flow Architecture

```
User Input
    ↓
Component (Vue)
    ↓
Action (Pinia Store)
    ↓
API Client (Axios)
    ↓
Backend API
    ↓
Response
    ↓
Store State Update
    ↓
Component Re-render
    ↓
UI Update
```

## 🐳 Docker Image Architecture

```
Stage 1: Builder
├── Node 18 Alpine
├── Install npm dependencies
└── Build Vue app (npm run build)
    ↓
Stage 2: Production
├── Nginx Alpine
├── Copy built dist from builder
├── Configure Nginx
├── Non-root user
└── Health check
```

**Image Size**: ~50-80MB (vs 400MB+ with full Node)

## 📱 Responsive Design

| Breakpoint | Width | Columns | Layout |
|-----------|-------|---------|--------|
| Mobile (sm) | < 640px | 1 | Stacked |
| Tablet (md) | 640-1024px | 2-3 | Two-column |
| Desktop (lg) | > 1024px | 4 | Multi-column |

## 🎨 Color Palette

| Color | Usage | Hex |
|-------|-------|-----|
| Indigo-600 | Primary actions | #4f46e5 |
| Indigo-50 | Light backgrounds | #eef2ff |
| Slate-900 | Dark text | #0f172a |
| Slate-600 | Secondary text | #475569 |
| Green-* | Success/active | #10b981 |
| Red-* | Danger | #ef4444 |

## 📦 Dependencies Overview

### Core Framework
- `vue@3.3.4` - UI framework
- `vue-router@4.2.4` - Client-side routing
- `pinia@2.1.4` - State management

### HTTP & API
- `axios@1.5.0` - HTTP client

### UI & Styling
- `tailwindcss@3.3.3` - CSS framework
- `lucide-vue3@0.294.0` - Icon library

### Build Tools
- `vite@4.4.10` - Build tool
- `@vitejs/plugin-vue@4.3.4` - Vue plugin
- `typescript@5.2.2` - Type checking

## 🔐 Security Features

✅ **Container Security**
- Non-root user execution
- Minimal Alpine Linux base
- No sudo/SSH access

✅ **Web Security**
- Security headers (X-Frame-Options, CSP-ready)
- XSS protection enabled
- Input validation in forms
- CORS-ready API client

✅ **Development**
- Environment variable separation
- No secrets in code
- TypeScript strict mode

## ⚡ Performance Features

✅ **Build Optimization**
- Tree-shaking (unused code removal)
- Code splitting by route
- Minification & compression

✅ **Runtime Optimization**
- Lazy route loading
- Computed property caching
- Efficient list rendering

✅ **Deployment Optimization**
- Gzip compression (Nginx)
- Asset caching strategies
- Minimal Docker image

## 📋 Setup Checklist

- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Copy `.env.example` to `.env.development`
- [ ] Update API URL in environment file
- [ ] Run `npm run dev` for local development
- [ ] Test all features (Dashboard, Employees, Reports, Settings)
- [ ] Run `npm run build` for production
- [ ] Test Docker build: `docker build -t work-edm .`
- [ ] Deploy to Azure or local container registry

## 🔗 API Integration Checklist

- [ ] API endpoint for `/api/employees` (GET all, POST create)
- [ ] API endpoint for `/api/employees/:id` (GET one, PUT update, DELETE)
- [ ] CORS enabled for frontend origin
- [ ] Auth headers configured (if needed)
- [ ] Error responses formatted consistently
- [ ] Response format matches Employee interface

## 📚 Documentation Files

| Document | Content |
|----------|---------|
| `README.md` | Project overview, setup, deployment |
| `DEVELOPMENT.md` | Local dev setup, workflow, best practices |
| `AZURE_DEPLOYMENT.md` | Azure Container Apps deployment |
| `PROJECT_STRUCTURE.md` | This file - architecture reference |

## 🚀 Quick Start Commands

```bash
# Development
npm run dev                 # Start dev server
npm run type-check         # Type checking
npm run build              # Production build
npm run preview            # Preview prod build

# Docker
docker build -t work-edm . # Build image
docker run -p 8080:8080 work-edm  # Run container

# Azure
az containerapp create ... # Deploy to Container Apps
az containerapp logs show # View logs
```

## 📞 Support & Resources

- **Issues**: Check GitHub Issues
- **Docs**: See README.md and DEVELOPMENT.md
- **Vue.js**: https://vuejs.org/
- **Vite**: https://vitejs.dev/
- **Tailwind**: https://tailwindcss.com/
- **Azure Docs**: https://learn.microsoft.com/azure/

---

**Version**: 1.0.0  
**Last Updated**: 2024  
**Framework**: Vue.js 3 + Vite  
**Deployment**: Docker + Azure Container Apps
