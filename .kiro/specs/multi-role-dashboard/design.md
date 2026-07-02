# Design Document

## Overview

The Multi-Role Dashboard is a MERN stack application with JWT authentication and role-based access control. The system uses a clean separation between frontend (React) and backend (Node.js/Express) with MongoDB for data persistence.

## Architecture

```
Frontend (React + Vite)
├── Authentication Layer (JWT)
├── Role-based Routing
├── Context API (State Management)
└── UI Components (Tailwind + ShadCN)

Backend (Node.js + Express)
├── Authentication Middleware
├── Role Authorization
├── RESTful API Routes
└── MongoDB Integration

Database (MongoDB)
├── Users Collection
├── Profiles Collection
└── Activities Collection
```

## Components and Interfaces

### Frontend Components
- **AuthProvider**: Context for authentication state
- **ProtectedRoute**: Route wrapper for authentication checks
- **AdminRoute**: Route wrapper for admin-only access
- **Dashboard**: Role-specific dashboard container
- **UserManagement**: Admin interface for user CRUD operations
- **ProfileForm**: User profile editing interface
- **ActivityList**: Display user activities

### API Endpoints
```
POST /api/auth/register
POST /api/auth/login
GET /api/auth/me
PUT /api/users/profile
GET /api/users/activities
GET /api/admin/users (admin only)
PUT /api/admin/users/:id (admin only)
DELETE /api/admin/users/:id (admin only)
GET /api/admin/stats (admin only)
```

## Data Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  status: String (enum: ['active', 'inactive'], default: 'active'),
  createdAt: Date
}
```

### Profile Schema
```javascript
{
  userId: ObjectId (ref: User),
  bio: String,
  profilePic: String (URL),
  preferences: Object,
  updatedAt: Date
}
```

### Activity Schema
```javascript
{
  userId: ObjectId (ref: User),
  action: String,
  timestamp: Date,
  details: Object
}
```

## Error Handling

- **Frontend**: React Error Boundaries + Toast notifications
- **Backend**: Global error middleware with structured responses
- **Validation**: Yup schemas on frontend, Mongoose validation on backend
- **Authentication**: JWT token validation with proper error responses

## Testing Strategy

- **Unit Tests**: Core business logic and utilities
- **Integration Tests**: API endpoints with database operations
- **Component Tests**: React components with user interactions
- **E2E Tests**: Critical user flows (login, dashboard access, user management)