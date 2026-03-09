# Task Manager Frontend

A modern, responsive frontend for the Task Manager application built with React, Vite, and Tailwind CSS.

## Features

- 🔐 User authentication (login/register)
- 📊 Interactive dashboard with task statistics
- ✅ Complete task management (CRUD operations)
- 🎨 Beautiful UI with Tailwind CSS
- 📱 Fully responsive design
- 🔍 Advanced filtering and search
- 👤 User profile management
- 👑 Admin panel for user management
- 🎯 Task prioritization and status tracking
- 📅 Due date management
- 🏷️ Tag support for task organization

## Installation

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

## Project Structure

```
frontend/
├── src/
│   ├── components/        # Reusable components
│   │   ├── auth/         # Authentication components
│   │   └── layout/       # Layout components (Navbar, etc.)
│   ├── contexts/         # React contexts
│   ├── pages/            # Page components
│   │   ├── admin/        # Admin panel
│   │   ├── auth/         # Login & Register
│   │   ├── dashboard/    # Dashboard
│   │   ├── profile/      # User profile
│   │   └── tasks/        # Task management
│   ├── services/         # API services
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main app component
│   ├── main.jsx          # Entry point
│   └── index.css         # Global styles
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features Overview

### Authentication
- Secure login and registration
- JWT token-based authentication
- Automatic token refresh
- Protected routes

### Dashboard
- Overview of all tasks
- Statistics by status and priority
- Recent tasks
- Quick access to create new tasks

### Task Management
- Create, read, update, and delete tasks
- Filter by status and priority
- Search functionality
- Sort tasks
- Set due dates
- Add tags
- Update task status

### User Profile
- View and edit profile information
- See account details

### Admin Panel (Admin only)
- View all users
- Delete users
- Search users
- User statistics

## Technologies Used

- **React 18** - UI library
- **Vite** - Build tool
- **React Router** - Routing
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **date-fns** - Date utilities
- **lucide-react** - Icons
- **react-hot-toast** - Notifications

## API Integration

The frontend connects to the backend API through a proxy configuration in Vite. All API calls are made to `/api` which is proxied to `http://localhost:3000`.

## Environment

The app is configured to work with the backend services running on `http://localhost:3000` (via nginx).
