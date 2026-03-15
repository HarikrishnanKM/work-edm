# work-edm: Employee Data Management System

A modern, responsive Single Page Application (SPA) for managing employee data built with Vue.js 3, Vite, and Tailwind CSS.

## Features

✨ **Modern Dashboard**: Real-time employee statistics and insights  
👥 **Employee Directory**: Full-featured employee management with search and filtering  
📊 **Reports & Analytics**: Comprehensive HR analytics and data export  
⚙️ **System Settings**: Configurable organization and security settings  
📱 **Responsive Design**: Optimized for mobile, tablet, and desktop  
🔐 **Production Ready**: Multi-stage Docker build, optimized for Azure Container Apps

## Tech Stack

- **Framework**: Vue.js 3 (Composition API)
- **Build Tool**: Vite (⚡ Fast development server)
- **Styling**: Tailwind CSS
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios
- **Icons**: Lucide Vue 3
- **TypeScript**: Full type safety

## Project Structure

```
.
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── EmployeeTable.vue
│   │   └── EmployeeFormModal.vue
│   ├── views/              # Page components
│   │   ├── DashboardView.vue
│   │   ├── EmployeeDirectoryView.vue
│   │   ├── ReportsView.vue
│   │   └── SettingsView.vue
│   ├── stores/             # Pinia state management
│   │   └── employeeStore.ts
│   ├── router/             # Vue Router configuration
│   │   └── index.js
│   ├── api/                # HTTP client configuration
│   │   └── client.ts
│   ├── App.vue            # Root component
│   ├── main.js            # Entry point
│   └── style.css          # Global styles
├── public/                # Static assets
├── Dockerfile             # Production-ready Docker build
├── docker-compose.yml     # Local development setup
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
├── tsconfig.json          # TypeScript configuration
├── package.json           # Dependencies
└── README.md              # This file
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Docker (for containerized deployment)

### Development Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd work-edm
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.development
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will be available at `http://localhost:5173`

### Environment Variables

Configure these variables in your `.env.development` or `.env.production` files:

```env
# API Configuration
VITE_API_URL=http://localhost:3000/api

# App Configuration
VITE_APP_NAME=work-edm
VITE_APP_VERSION=1.0.0
```

**For Azure Container Apps**: Set `VITE_API_URL=/api` to use a relative path, allowing your API and frontend to be served from the same domain.

## Available Scripts

```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking
npm run type-check

# Lint and fix code
npm run lint
```

## Docker Deployment

### Build Docker Image

```bash
# Build the image
docker build -t work-edm:latest .

# Run locally
docker run -p 8080:8080 \
  -e VITE_API_URL=http://localhost:3000/api \
  work-edm:latest
```

### Push to Azure Container Registry

```bash
# Log in to ACR
az acr login --name <your-registry-name>

# Tag the image
docker tag work-edm:latest <your-registry-name>.azurecr.io/work-edm:latest

# Push to ACR
docker push <your-registry-name>.azurecr.io/work-edm:latest
```

### Deploy to Azure Container Apps

```bash
az containerapp create \
  --name work-edm \
  --resource-group <resource-group> \
  --image <your-registry>.azurecr.io/work-edm:latest \
  --target-port 8080 \
  --ingress external \
  --environment <env-name> \
  --environment-variables VITE_API_URL=<your-api-url>
```

## API Integration

The app is configured to make requests to an API at the base URL specified by `VITE_API_URL`.

### Expected API Endpoints

The app expects the following REST endpoints:

```
GET    /api/employees          # Fetch all employees
POST   /api/employees          # Create a new employee
GET    /api/employees/:id      # Get employee by ID
PUT    /api/employees/:id      # Update employee
DELETE /api/employees/:id      # Delete employee
```

### Response Format

Employees should be returned in this format:

```json
{
  "id": "string",
  "name": "string",
  "email": "string",
  "position": "string",
  "department": "string",
  "joinDate": "YYYY-MM-DD",
  "status": "active|inactive|on-leave",
  "avatar": "string (optional)"
}
```

## Features Overview

### Dashboard
- Total employee count
- Active employees statistics
- Department breakdown with visual progress bars
- New hires in the last 30 days
- Recent employee additions
- Quick statistics and links

### Employee Directory
- Searchable employee table
- Filter by department
- Pagination (10 per page)
- Create new employees
- Edit existing employees
- Delete employees with confirmation
- Employee status badge (Active/Inactive/On Leave)

### Reports
- Employee distribution by department
- Employee status breakdown
- Hiring trend analytics
- Quick statistics
- CSV data export
- PDF export (requires jsPDF/pdfkit)

### Settings
- General organization settings
- Security configuration
- API key management
- Notification preferences

## Styling & Customization

### Color Palette

The app uses a professional indigo-based color scheme:
- **Primary**: Indigo-600 (`#4f46e5`)
- **Accent**: Indigo-50 to Indigo-900
- **Neutral**: Slate-50 to Slate-900

### Typography

- **Font**: Inter (via Tailwind defaults)
- **Display**: Bold headings (lg, 2xl)
- **Body**: Regular weights with proper hierarchy

### Responsive Breakpoints

- **Mobile**: < 640px (sm)
- **Tablet**: 640px - 1024px (md, lg)
- **Desktop**: > 1024px (xl)

## Performance Optimizations

✅ Multi-stage Docker build (production image ~50MB)  
✅ Gzip compression enabled in Nginx  
✅ CSS and JS asset minification  
✅ Image lazy loading ready  
✅ SPA route caching strategy  
✅ Tree-shaking for unused code removal

## Security

✅ Non-root user in Docker container  
✅ Security headers (X-Frame-Options, CSP-ready)  
✅ Input validation in forms  
✅ CORS-ready API client  
✅ Environment variable separation (dev/prod)

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Troubleshooting

### API Connection Issues

If the app can't connect to the backend:

1. **Check the API URL** in your `.env` file
2. **Verify CORS** is enabled on your API
3. **Check network tab** in browser DevTools for failed requests
4. **Use relative paths** (`/api`) when frontend and backend are on the same domain

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf .vite
npm run dev
```

### Docker Issues

```bash
# Rebuild without cache
docker build --no-cache -t work-edm:latest .

# Check container logs
docker logs <container-id>

# Test locally
docker run -it -p 8080:8080 work-edm:latest
```

## Contributing

1. Create a feature branch (`git checkout -b feature/amazing-feature`)
2. Commit changes (`git commit -m 'Add amazing feature'`)
3. Push to branch (`git push origin feature/amazing-feature`)
4. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For issues, feature requests, or questions:
- Create an issue on GitHub
- Contact the development team

---

**Built with ❤️ using Vue.js 3 and modern web technologies**

Happy coding! 🚀
