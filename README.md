# 🚀 Agency Task Manager

A full-stack **task management application** with role-based access (Admin & Member), personal to-dos, and a REST API—built to industry-standard practices with a modern React frontend and Node.js backend.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation & Setup](#installation-setup)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [API Reference](#api-reference)
- [User Roles & Flows](#user-roles-flows)
- [Scripts](#scripts)
- [Author](#author)

---

## 🎯 Overview {#overview}

**Agency Task Manager** is a monorepo application that provides:

- **Personal to-dos** — A local, device-only to-do list (no account required) stored in `localStorage`.
- **Agency tasks** — Admin-assigned tasks for members, persisted in **MongoDB**, with JWT-based authentication and role-based dashboards.

The app is split into a **React (Vite)** frontend and an **Express** backend, with clear separation of concerns and scalable structure.

---

## ✨ Features {#features}

### 🔐 Authentication & Authorization

| Feature | Description |
| ------- | ----------- |
| **JWT-based auth** | Secure login with HTTP-only token handling; token sent via `Authorization: Bearer` header. |
| **Role-based access** | Two roles: **Admin** and **Member**; routes and API endpoints enforce roles. |
| **Protected routes** | Frontend uses `ProtectedRoute` to redirect unauthenticated or unauthorized users. |
| **Persistent session** | On load, `/auth/me` validates the token and restores user state. |

### 📌 Personal To-Dos (Home)

| Feature | Description |
| ------- | ----------- |
| **Local only** | Data stored in browser `localStorage`; no backend or account required. |
| **CRUD** | Add, edit, toggle complete, and delete items. |
| **Persistence** | List is read on mount and saved on every change; survives refresh. |

### 👑 Admin Dashboard

| Feature | Description |
| ------- | ----------- |
| **Create members** | Add new members (name, email, password) for your team. |
| **List members** | Fetch all members to assign tasks. |
| **Create tasks** | Create tasks with a title and assign them to a member. |
| **Manage tasks** | View all tasks, edit title, toggle status (pending/completed), delete. |

### 👤 Member Dashboard

| Feature | Description |
| ------- | ----------- |
| **My tasks** | View only tasks assigned to the logged-in member. |
| **Mark complete** | One-click to mark a task as completed (with backend validation). |
| **Welcome state** | Optional “just logged in” message when arriving from login. |

### 🧭 Navigation & UX

| Feature | Description |
| ------- | ----------- |
| **Navbar** | Home (personal todos), Login (when guest), User name → dashboard, Logout. |
| **Login UX** | Success message, short delay, then redirect with `replace` so Back doesn’t return to login. |
| **Login page** | Back and Home buttons for easy navigation. |

---

## 🛠 Tech Stack {#tech-stack}

### Frontend

| Technology | Purpose |
| ---------- | ------- |
| **React 19** | UI library and component model. |
| **Vite 7** | Build tool, dev server, and fast HMR. |
| **React Router 7** | Client-side routing (`/home`, `/login`, `/admin`, `/member`). |
| **Tailwind CSS 4** | Utility-first styling (`bg-linear-to-br`, spacing, etc.). |
| **Axios** | HTTP client; base URL and auth header interceptor. |

### Backend

| Technology | Purpose |
| ---------- | ------- |
| **Node.js** | Runtime. |
| **Express 5** | REST API server, middleware, routing. |
| **MongoDB** | Database for users and tasks. |
| **Mongoose 9** | ODM: schemas, validation, middleware. |
| **JWT (jsonwebtoken)** | Sign and verify tokens for auth. |
| **bcryptjs** | Password hashing and comparison. |
| **cors** | Allow cross-origin requests from the frontend. |
| **dotenv** | Load environment variables from `.env`. |

---

## 📁 Project Structure {#project-structure}

```text
to-do-application/
├── frontend/                 # React (Vite) SPA
│   ├── src/
│   │   ├── components/       # Reusable UI (Navbar, Loader, ProtectedRoute, TodoForm, etc.)
│   │   ├── context/          # AuthContext (user, login, logout)
│   │   ├── pages/            # Route-level views (Home, Login, AdminDashboard, MemberDashboard)
│   │   ├── services/         # API client and service functions (api, taskService, authService)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
├── backend/                  # Express API
│   ├── config/               # DB connection
│   ├── controllers/         # authController, taskController
│   ├── middlewares/          # verifyToken, authorizeRoles, isAdmin
│   ├── models/               # User, Task (Mongoose schemas)
│   ├── routes/               # authRoutes, taskRoutes
│   ├── scripts/              # seedUsers.js (create sample admin & member)
│   ├── utils/                # validateObjectId
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## 📌 Prerequisites {#prerequisites}

Before you begin, ensure you have installed:

| Requirement | Purpose |
| ----------- | ------- |
| **Node.js** (v18+ recommended) | Run frontend and backend. |
| **npm** (or yarn/pnpm) | Install dependencies. |
| **MongoDB** | Local instance or MongoDB Atlas connection string. |

---

## 📥 Installation & Setup {#installation-setup}

### 1. Clone the repository

```bash
git clone <repository-url>
cd to-do-application
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend` folder (see [Environment Variables](#environment-variables)).

### 3. Frontend setup

```bash
cd frontend
npm install
```

### 4. Seed sample users (optional but recommended)

From the `backend` folder:

```bash
npm run seed
```

This creates:

- **Admin** — `admin@example.com` / `admin123`
- **Member** — `member@example.com` / `member123`

---

## 🔐 Environment Variables {#environment-variables}

Create `backend/.env` with at least:

| Variable | Description | Example |
| -------- | ----------- | ------- |
| `MONGO_URI` | MongoDB connection string | `mongodb://localhost:27017/todo-app` or Atlas URI |
| `JWT_SECRET` | Secret used to sign JWT tokens | A long, random string |
| `JWT_EXPIRE` | Token expiry (optional) | `7d` |

Example:

```env
MONGO_URI=mongodb://localhost:27017/agency-task-manager
JWT_SECRET=your-super-secret-key-change-in-production
JWT_EXPIRE=7d
PORT=5000
```

---

## ▶️ Running the Application {#running-the-application}

### Backend (API)

From the project root:

```bash
cd backend
npm start
```

Or, for development with auto-restart:

```bash
npm run dev
```

The API runs at <http://localhost:5000> (or the port in `PORT`).

### Frontend (React)

In a separate terminal:

```bash
cd frontend
npm run dev
```

The app runs at <http://localhost:5173> (or the port Vite assigns).

Ensure the frontend `api` base URL matches your backend (default in `frontend/src/services/api.js` is `http://localhost:5000/api`).

---

## 📡 API Reference {#api-reference}

Base URL: `http://localhost:5000/api`

### Auth (`/api/auth`)

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/register-admin` | No | Create the first admin (name, email, password). |
| POST | `/login` | No | Login; returns `token` and `user`. |
| GET | `/me` | Yes (Bearer) | Current user profile. |
| POST | `/create-member` | Yes (Admin) | Create a new member. |
| GET | `/members` | Yes (Admin) | List all members. |

### Tasks (`/api/tasks`)

| Method | Endpoint | Auth | Description |
| ------ | -------- | ---- | ----------- |
| POST | `/` | Admin | Create task (title, assignedTo, optional description). |
| GET | `/all` | Admin | List all tasks. |
| GET | `/my` | Member | List tasks assigned to current user. |
| PUT | `/:id` | Admin | Update task (e.g. title, status). |
| DELETE | `/:id` | Admin | Delete task. |
| PATCH | `/:id/complete` | Member | Mark task as completed (own tasks only). |

Responses use a consistent shape where applicable: `{ success: true, data: ... }` or `{ success: false, message: "..." }`.

---

## 👥 User Roles & Flows {#user-roles-flows}

### Guest (not logged in)

- **Home** → Personal to-dos (localStorage).
- **Login** → Login page; after success → redirect to Admin or Member dashboard by role.

### Admin

- **Home** → Personal to-dos.
- **Name (in navbar)** → Admin dashboard: create members, create/assign tasks, edit/delete/toggle tasks.
- **Logout** → Clear token, redirect to Home.

### Member

- **Home** → Personal to-dos.
- **Name (in navbar)** → Member dashboard: view assigned tasks, mark complete.
- **Logout** → Clear token, redirect to Home.

---

## 📜 Scripts {#scripts}

### Backend (`backend/package.json`)

| Script | Command | Description |
| ------ | ------- | ----------- |
| `start` | `node server.js` | Run production server. |
| `dev` | `nodemon server.js` | Run with auto-restart. |
| `seed` | `node scripts/seedUsers.js` | Create sample admin and member in DB. |

### Frontend (`frontend/package.json`)

| Script | Command | Description |
| ------ | ------- | ----------- |
| `dev` | `vite` | Start dev server with HMR. |
| `build` | `vite build` | Production build. |
| `preview` | `vite preview` | Preview production build locally. |
| `lint` | `eslint .` | Run ESLint. |

---

## 👤 Author

Raghav

---
