# Frontend Development Guide

## Technology Stack

- **React 18** - Modern UI library with hooks
- **Vite** - Fast build tool and dev server
- **React Router 6** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **date-fns** - Date manipulation
- **lucide-react** - Beautiful icons
- **react-hot-toast** - Toast notifications

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm or yarn

### Installation

```bash
cd frontend
npm install
```

### Environment Variables

The frontend uses a proxy configuration in `vite.config.js` to connect to the backend API. By default, it proxies `/api` requests to `http://localhost:3000`.

### Running Development Server

```bash
npm run dev
```

The app will be available at http://localhost:5173 with hot module replacement.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist` folder.

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
frontend/
├── src/
│   ├── components/           # Reusable components
│   │   ├── auth/            # Auth-related components
│   │   │   └── ProtectedRoute.jsx
│   │   └── layout/          # Layout components
│   │       ├── Layout.jsx
│   │       └── Navbar.jsx
│   ├── contexts/            # React contexts
│   │   └── AuthContext.jsx  # Authentication context
│   ├── pages/               # Page components
│   │   ├── admin/
│   │   │   └── AdminPanel.jsx
│   │   ├── auth/
│   │   │   ├── Login.jsx
│   │   │   └── Register.jsx
│   │   ├── dashboard/
│   │   │   └── Dashboard.jsx
│   │   ├── profile/
│   │   │   └── Profile.jsx
│   │   ├── tasks/
│   │   │   ├── TaskDetail.jsx
│   │   │   ├── TaskForm.jsx
│   │   │   └── TaskList.jsx
│   │   └── Landing.jsx
│   ├── services/            # API service layer
│   │   ├── api.js          # Axios instance with interceptors
│   │   ├── auth.service.js # Authentication API calls
│   │   ├── task.service.js # Task API calls
│   │   └── user.service.js # User API calls
│   ├── utils/              # Utility functions
│   │   └── helpers.js      # Date formatting, colors, etc.
│   ├── App.jsx             # Main app component with routing
│   ├── main.jsx            # Entry point
│   └── index.css           # Global styles
├── public/                 # Static assets
├── index.html             # HTML template
├── package.json           # Dependencies
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind configuration
└── postcss.config.js      # PostCSS configuration
```

## Key Features

### Authentication Flow

1. User logs in or registers
2. JWT tokens are stored in localStorage
3. AuthContext manages authentication state
4. Protected routes check authentication status
5. API interceptor automatically adds token to requests
6. Token refresh happens automatically on 401 errors

### State Management

- **AuthContext**: Global authentication state
- **Local state**: Component-level state with useState
- **API calls**: Centralized in service layer

### Routing

Routes are defined in `App.jsx`:
- `/` - Landing page
- `/login` - Login page
- `/register` - Registration page
- `/dashboard` - Dashboard (protected)
- `/tasks` - Task list (protected)
- `/tasks/new` - Create task (protected)
- `/tasks/:id` - Task details (protected)
- `/tasks/:id/edit` - Edit task (protected)
- `/profile` - User profile (protected)
- `/admin` - Admin panel (protected, admin only)

### API Integration

All API calls go through the service layer:

```javascript
// services/task.service.js
import apiClient from './api';

export const taskService = {
  async getAllTasks(params) {
    const response = await apiClient.get('/tasks', { params });
    return response.data;
  },
  // ... more methods
};
```

The `apiClient` is an Axios instance with interceptors that:
- Adds JWT token to all requests
- Handles token refresh automatically
- Redirects to login on auth failure

### Styling

Uses Tailwind CSS with custom utilities defined in `tailwind.config.js`:

```javascript
// Custom button classes
.btn-primary    // Primary action button
.btn-secondary  // Secondary button
.btn-danger     // Delete/danger button

// Custom input
.input-field    // Styled input field

// Custom components
.card          // Card container
.badge         // Status/priority badges
```

## Common Development Tasks

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `App.jsx`
3. Import and use in JSX

### Adding API Endpoint

1. Add method to appropriate service file
2. Use in component with try/catch
3. Handle loading and error states

### Creating a Component

```jsx
const MyComponent = ({ prop }) => {
  const [state, setState] = useState(initialValue);

  useEffect(() => {
    // Side effects
  }, [dependencies]);

  return (
    <div className="card">
      {/* Your JSX */}
    </div>
  );
};

export default MyComponent;
```

### Using the Auth Context

```jsx
import { useAuth } from '../contexts/AuthContext';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated } = useAuth();

  // Use authentication state and methods
};
```

## Best Practices

1. **Component Organization**: Keep components small and focused
2. **Error Handling**: Always wrap API calls in try/catch
3. **Loading States**: Show loading indicators for async operations
4. **Toast Notifications**: Use for user feedback
5. **Responsive Design**: Test on different screen sizes
6. **Code Splitting**: Use dynamic imports for large components
7. **Accessibility**: Use semantic HTML and ARIA labels

## Debugging

### React DevTools

Install React DevTools browser extension for component inspection.

### Network Debugging

Use browser DevTools Network tab to inspect API requests.

### Common Issues

**API calls fail with CORS error:**
- Check Vite proxy configuration
- Ensure backend is running on correct port

**Token expired errors:**
- Check token refresh logic in `api.js`
- Verify JWT expiration settings

**Styles not applying:**
- Run `npm run dev` to rebuild Tailwind
- Check class names for typos

## Performance Optimization

1. **Lazy Loading**: Use React.lazy() for route-based code splitting
2. **Memoization**: Use useMemo/useCallback for expensive operations
3. **Image Optimization**: Compress images before adding
4. **Bundle Analysis**: Run `npm run build` and check bundle size

## Testing

```bash
# Run linter
npm run lint

# Build for production (catches TypeScript errors)
npm run build
```

## Deployment

The frontend is containerized with Docker:

```bash
# Build Docker image
docker build -t taskmanager-frontend .

# Run container
docker run -p 5173:80 taskmanager-frontend
```

Or use Docker Compose:

```bash
docker-compose up frontend
```

## Contributing

1. Follow existing code style
2. Use meaningful variable/function names
3. Add comments for complex logic
4. Test on multiple browsers
5. Ensure responsive design works
