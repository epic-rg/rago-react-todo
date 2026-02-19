# 🚀 Agency Task Manager (React + Node + MongoDB)

A full-stack task management app with **role-based access**:

- **Admin** creates members and assigns tasks
- **Member** manages their own assigned tasks
- **Guest** can still use local personal todos on Home

This repo contains:

- `frontend/` → React + Vite app
- `backend/` → Express + MongoDB API

---

## 🌍 Live Demo

### **🔗 LINK: <https://rago-agency-task-manager.vercel.app/>**

---

## ✨ What’s New / Current Behavior

### Admin-member scoping (important)

The backend now enforces ownership boundaries:

- Each member has a `managedBy` admin.
- Admin can only:
  - view members they created,
  - view tasks for those members,
  - create/update/delete tasks only for those members.
- Admin **cannot** access another admin’s member data.

### Admin delete member feature

In admin dashboard, admin can now delete a member.

Backend behavior:

- `DELETE /api/auth/members/:memberId`
- Deletes the member **only if** they belong to the logged-in admin.
- Also deletes all tasks assigned to that member.

---

## 🧱 Tech Stack

### Frontend

- React 19
- Vite 7
- React Router 7
- Axios
- Tailwind CSS 4

### Backend

- Node.js
- Express 5
- MongoDB + Mongoose
- JWT (`jsonwebtoken`)
- `bcryptjs`
- `dotenv`, `cors`

---

## 📁 Project Structure

```txt
to-do-application/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── services/
│   └── package.json
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middlewares/
│   ├── models/
│   ├── routes/
│   ├── scripts/
│   ├── Dockerfile
│   ├── fly.toml
│   └── package.json
├── .github/workflows/fly-deploy.yaml
└── README.md
```

---

## ⚙️ Prerequisites

- Node.js (18+ recommended)
- npm
- MongoDB (local or Atlas)

---

## 🔐 Environment Variables

Create `backend/.env`:

```env
MONGO_URI=mongodb://localhost:27017/agency-task-manager
JWT_SECRET=your-super-secret
JWT_EXPIRE=7d
PORT=5000
```

Create `frontend/.env`:

```env
VITE_API_URL=http://localhost:5000
```

> Frontend API client uses: `${VITE_API_URL}/api`

---

## ▶️ Run Locally

### 1) Install dependencies

```bash
# backend
npm --prefix backend install

# frontend
npm --prefix frontend install
```

### 2) Start backend

```bash
npm --prefix backend run dev
```

### 3) Start frontend

```bash
npm --prefix frontend run dev
```

Frontend: `http://localhost:5173`  
Backend: `http://localhost:5000`

---

## 👤 Seed Users (Demo + Personal)

### Shared demo seed (safe for repo)

Run:

```bash
npm --prefix backend run seed
```

Creates/updates:

- Admin: `demo.admin@example.com / demoadmin123`
- Member (under demo admin): `demo.member@example.com / demomember123`

---

## 📡 API Summary

Base URL: `http://localhost:5000/api`

### Auth routes

- `POST /auth/register-admin`
- `POST /auth/login`
- `GET /auth/me`
- `POST /auth/create-member` (admin)
- `GET /auth/members` (admin, scoped)
- `DELETE /auth/members/:memberId` (admin, scoped)

### Task routes

- `POST /tasks` (admin, scoped assignment)
- `GET /tasks/all` (admin, scoped)
- `GET /tasks/user/:userId` (admin, scoped)
- `PUT /tasks/:id` (admin, scoped)
- `DELETE /tasks/:id` (admin, scoped)
- `GET /tasks/my` (member)
- `PATCH /tasks/:id/complete` (member)

---

## 🐳 Docker (Backend)

`backend/Dockerfile` is configured for production-style container run.

Build image:

```bash
docker build -t agency-task-manager-backend ./backend
```

Run container:

```bash
docker run --rm -p 8080:8080 \
  -e PORT=8080 \
  -e MONGO_URI="<your_mongo_uri>" \
  -e JWT_SECRET="<your_jwt_secret>" \
  -e JWT_EXPIRE="7d" \
  agency-task-manager-backend
```

Health check endpoint:

- `GET /` → `API Running...`

---

## 🚀 Fly.io Deployment

Fly config is in `backend/fly.toml`:

- app name: `agency-task-manager`
- internal port: `8080`
- region: `bom`
- min machine: `1`

### Manual deploy

```bash
cd backend
flyctl deploy
```

Set Fly secrets:

```bash
flyctl secrets set MONGO_URI="<value>" JWT_SECRET="<value>" JWT_EXPIRE="7d"
```

---

## 🔁 GitHub Actions CI/CD (Fly Deploy)

Workflow: `.github/workflows/fly-deploy.yaml`

Trigger:

- push to `main`

Steps:

1. Checkout repo
2. Setup `flyctl`
3. Deploy from `backend/` with `flyctl deploy --remote-only`

Required GitHub secret:

- `FLY_API_TOKEN`

---

## 📜 Scripts

### Backend Commands

- `npm --prefix backend run start`
- `npm --prefix backend run dev`
- `npm --prefix backend run seed`

### Frontend Commands

- `npm --prefix frontend run dev`
- `npm --prefix frontend run build`
- `npm --prefix frontend run preview`
- `npm --prefix frontend run lint`

---

## 👨‍💻 Author

Raghav
