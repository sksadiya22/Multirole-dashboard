# Multi-Role Dashboard

A full-stack MERN application with role-based access control, featuring JWT authentication and personalized dashboards for admin and standard users.

![Multi-Role Dashboard](https://img.shields.io/badge/MERN-Stack-green) ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-brightgreen) ![JWT](https://img.shields.io/badge/JWT-Authentication-blue) ![Role Based](https://img.shields.io/badge/Role--Based-Access-orange)

## 🚀 Features

### 🔐 **Secure Authentication & Authorization**
- JWT-based authentication with token management
- Password hashing with bcryptjs (12 salt rounds)
- Role-based access control (Admin/User)
- Protected routes on both frontend and backend
- Session management with automatic token refresh

### 👥 **Role-Based Access Control**
- **Admin Dashboard**: User management, system statistics, activity monitoring
- **User Dashboard**: Profile management, activity history, preferences
- Dynamic navigation based on user roles
- Conditional UI rendering based on permissions

### 🛠️ **RESTful API Development**
- Complete CRUD operations for user management
- Pagination, filtering, and search functionality
- Input validation with express-validator
- Comprehensive error handling and logging
- Activity tracking for all user actions

### 🗄️ **MongoDB Schema Design**
- Optimized database schemas with proper indexing
- User schema with preferences and profile management
- Activity logging with metadata and IP tracking
- Relationship management between collections
- Data validation and constraints

### 🎨 **Modern Frontend**
- React.js with Context API for state management
- React Hook Form with Yup validation
- Responsive design with custom CSS
- Toast notifications for user feedback
- Loading states and error boundaries

## 🏗️ Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs for password hashing
- **Environment**: dotenv for configuration

### Frontend
- **Library**: React.js
- **Routing**: React Router DOM
- **Forms**: React Hook Form + Yup validation
- **HTTP Client**: Axios with interceptors
- **Notifications**: React Hot Toast
- **Styling**: Custom CSS (responsive design)

### Database
- **Primary**: MongoDB Atlas (Cloud)
- **Fallback**: Demo mode with in-memory data
- **ODM**: Mongoose with schema validation

## 📁 Project Structure

```
multi-role-dashboard/
├── backend/                    # Node.js/Express API
│   ├── src/
│   │   ├── config/            # Database configuration
│   │   ├── controllers/       # Route handlers
│   │   │   ├── authController.js
│   │   │   ├── userController.js
│   │   │   ├── adminController.js
│   │   │   └── demoAuthController.js
│   │   ├── middleware/        # Authentication & validation
│   │   │   ├── auth.js
│   │   │   └── validation.js
│   │   ├── models/           # Mongoose schemas
│   │   │   ├── User.js
│   │   │   └── Activity.js
│   │   ├── routes/           # API routes
│   │   │   ├── auth.js
│   │   │   ├── users.js
│   │   │   ├── admin.js
│   │   │   └── demo*.js
│   │   ├── utils/            # Helper functions
│   │   │   └── jwt.js
│   │   └── server.js         # Express server setup
│   ├── .env                  # Environment variables
│   └── package.json
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── ProfilePage.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── contexts/         # React contexts
│   │   │   └── AuthContext.jsx
│   │   ├── App.jsx           # Main app component
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
├── .kiro/                    # Kiro IDE specifications
│   └── specs/
│       └── multi-role-dashboard/
│           ├── requirements.md
│           ├── design.md
│           └── tasks.md
├── .gitignore
├── README.md
└── package.json              # Root package.json
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB Atlas account (or local MongoDB)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/multi-role-dashboard.git
   cd multi-role-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Environment Setup**
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Update `backend/.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   JWT_EXPIRE=7d
   ```

4. **Start the application**
   ```bash
   npm run dev
   ```

   This starts both servers:
   - Backend: http://localhost:5000
   - Frontend: http://localhost:3000

## 📚 API Documentation

### Authentication Endpoints
```
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
POST /api/auth/logout      # User logout
```

### User Endpoints
```
PUT  /api/users/profile           # Update user profile
GET  /api/users/activities        # Get user activities
PUT  /api/users/change-password   # Change password
```

### Admin Endpoints (Admin Only)
```
GET    /api/admin/users           # Get all users (with pagination)
GET    /api/admin/users/:id       # Get user by ID
POST   /api/admin/users           # Create new user
PUT    /api/admin/users/:id       # Update user
DELETE /api/admin/users/:id       # Delete user
GET    /api/admin/stats           # System statistics
GET    /api/admin/activities      # All system activities
```

### Example API Usage

**Register a new user:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123"
  }'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

## 🎯 Key Features Implemented

### 1. **Secure Role-Based Authentication**
- JWT token generation and verification
- Password hashing with bcrypt (12 salt rounds)
- Role-based middleware for route protection
- Automatic token refresh and session management

### 2. **Comprehensive User Management**
- User registration with validation
- Profile management with image upload support
- Activity tracking and logging
- Admin controls for user management

### 3. **RESTful API Design**
- Complete CRUD operations
- Pagination and filtering
- Input validation and sanitization
- Comprehensive error handling
- Activity logging for audit trails

### 4. **MongoDB Integration**
- Optimized schema design
- Proper indexing for performance
- Data validation and constraints
- Relationship management
- Aggregation pipelines for statistics

### 5. **Modern Frontend Architecture**
- Component-based React architecture
- Context API for global state management
- Protected routes with role-based access
- Form validation with real-time feedback
- Responsive design for all devices

## 🔧 Development Features

### Demo Mode
The application includes a demo mode that works without MongoDB:
- In-memory data storage
- Pre-configured demo users
- All features functional for testing
- Automatic fallback when database unavailable

### Demo Credentials
```
Admin: admin@demo.com / password123
User:  user@demo.com / password123
```

### Environment Modes
- **Development**: Full logging and error details
- **Production**: Optimized performance and security
- **Demo**: In-memory data for testing

## 🧪 Testing

### Manual Testing
1. **Authentication Flow**
   - Register new users
   - Login with valid/invalid credentials
   - Test role-based access

2. **Admin Features**
   - User management (CRUD operations)
   - System statistics viewing
   - Activity monitoring

3. **User Features**
   - Profile management
   - Activity history viewing
   - Preference settings

### API Testing with Postman
Import the API endpoints and test:
- Authentication flows
- CRUD operations
- Role-based access control
- Error handling scenarios

## 🚀 Deployment

### Backend Deployment
1. Set environment variables
2. Configure MongoDB connection
3. Deploy to platforms like Heroku, Railway, or DigitalOcean

### Frontend Deployment
1. Build the React app: `npm run build`
2. Deploy to Netlify, Vercel, or similar platforms
3. Configure API base URL for production

### Database Setup
- MongoDB Atlas (recommended for production)
- Local MongoDB for development
- Ensure proper indexing and security

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with the MERN stack
- JWT authentication implementation
- MongoDB Atlas for cloud database
- React ecosystem for frontend development
- Express.js for robust backend API

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the API documentation
- Review the demo mode for testing

---

**Multi-Role Dashboard** - A comprehensive example of modern full-stack development with role-based access control.