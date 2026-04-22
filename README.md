# Task Manager API — Backend Developer Intern Assignment

A **scalable REST API** with **JWT Authentication**, **Role-Based Access Control**, and a **React frontend** — built for the Primetrade.ai Backend Developer Intern assignment.

---

## 🛠 Tech Stack

| Layer | Tech |
|---|---|
| Backend | Node.js, Express.js |
| Database | MongoDB (Mongoose ODM) |
| Auth | JWT + bcryptjs |
| Validation | express-validator |
| API Docs | Swagger / OpenAPI 3.0 |
| Frontend | React.js (Vite) |

---

## ✅ Features Implemented

### Backend
- ✅ User registration & login with **bcrypt password hashing**
- ✅ **JWT authentication** (7-day expiry)
- ✅ **Role-based access control** — `user` and `admin` roles
- ✅ Full **CRUD APIs** for Tasks (title, description, status, priority, due date)
- ✅ **API versioning** — `/api/v1/`
- ✅ Global **error handling** middleware
- ✅ Input **validation & sanitization** (express-validator)
- ✅ **Swagger UI** documentation at `/api-docs`
- ✅ Admin-only user management endpoints

### Frontend
- ✅ Register & Login pages
- ✅ JWT-protected Dashboard
- ✅ Full task CRUD UI (create, edit, delete, filter by status)
- ✅ Admin Panel to manage users & roles
- ✅ Success/error feedback on all actions

---

## 📁 Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/db.js           # MongoDB connection
│   │   ├── middleware/
│   │   │   ├── auth.js            # JWT protect + adminOnly guards
│   │   │   ├── validate.js        # express-validator error formatter
│   │   │   └── errorHandler.js    # Global error handler
│   │   ├── models/
│   │   │   ├── User.js            # User schema (bcrypt pre-save hook)
│   │   │   └── Task.js            # Task schema
│   │   ├── controllers/
│   │   │   ├── auth.controller.js
│   │   │   ├── task.controller.js
│   │   │   └── user.controller.js
│   │   └── routes/
│   │       ├── auth.routes.js     # /api/v1/auth
│   │       ├── task.routes.js     # /api/v1/tasks
│   │       └── user.routes.js     # /api/v1/users (admin)
│   ├── swagger.js
│   ├── server.js
│   └── .env
└── frontend/
    └── src/
        ├── context/AuthContext.jsx
        ├── components/ (Navbar, ProtectedRoute)
        └── pages/ (Login, Register, Dashboard, AdminPanel)
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (free tier)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/task-manager-api.git
cd task-manager-api
```

### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
```

### 3. Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

### 4. Open in browser
- **Frontend:** http://localhost:3000
- **API Docs (Swagger):** http://localhost:5000/api-docs

---

## 🔐 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/taskmanager
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=7d
```

---

## 📚 API Endpoints

### Auth
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Register new user |
| POST | `/api/v1/auth/login` | ❌ | Login, returns JWT |
| GET | `/api/v1/auth/me` | ✅ | Get current user |

### Tasks
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/tasks` | ✅ | Get tasks (own / all for admin) |
| POST | `/api/v1/tasks` | ✅ | Create task |
| GET | `/api/v1/tasks/:id` | ✅ | Get single task |
| PUT | `/api/v1/tasks/:id` | ✅ | Update task (owner/admin) |
| DELETE | `/api/v1/tasks/:id` | ✅ | Delete task (owner/admin) |

### Users (Admin Only)
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/users` | 👑 Admin | List all users |
| GET | `/api/v1/users/:id` | 👑 Admin | Get user by ID |
| PUT | `/api/v1/users/:id/role` | 👑 Admin | Update user role |
| DELETE | `/api/v1/users/:id` | 👑 Admin | Delete user |

---

## 📏 Scalability Notes

**Current architecture supports horizontal scaling through:**

1. **Stateless JWT Auth** — No server-side sessions; any instance can verify tokens.
2. **MongoDB Atlas** — Auto-sharding and replica sets for high availability.
3. **Modular route/controller/model separation** — New modules (e.g., Projects, Teams) plug in cleanly.
4. **API versioning** (`/api/v1/`) — Allows non-breaking changes and parallel version support.

**Production enhancements (roadmap):**
- **Redis caching** — Cache frequent reads (e.g., task lists) to reduce DB load.
- **Rate limiting** — `express-rate-limit` per IP to prevent abuse.
- **Docker** — Containerize backend + frontend for consistent deployments.
- **Load balancer** — Nginx or AWS ALB in front of multiple Node instances.
- **Microservices** — Split Auth, Tasks, and Notifications into independent services as scale demands.
- **Message Queue** — RabbitMQ/Kafka for async operations (emails, notifications).

---



*Built with ❤️ for Primetrade.ai Backend Developer Intern Assignment*
