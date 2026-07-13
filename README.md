# Store Rating Platform

A full-stack web application where users can discover stores, rate them, and leave feedback while store owners and admins get dedicated dashboards to manage their side of the platform.

---

## About the Project

RateStore connects three types of users on a single platform:

- **Users** can browse stores, search/filter by name or address, and submit ratings (1–5) for the stores they've visited.
- **Store Owners** get a dashboard to view ratings received on their store and track average performance.
- **Admins** manage the whole platform adding/removing stores, managing users, and viewing overall platform stats.

The goal was to build a real-world, role-based system from scratch covering authentication, authorization, database design, and a clean, responsive UI and deploy it fully on free-tier cloud infrastructure.

---

## Tech Stack

**Frontend**
- React (Vite)
- Custom design system (bento grid layout, SVG icon set, design tokens)
- Axios for API calls

**Backend**
- Node.js + Express.js
- JWT-based authentication
- Role-based access control (RBAC) middleware

**Database**
- MySQL (via `mysql2`)
- Hosted on Aiven (managed, SSL-secured)

**Deployment**
- Frontend → Vercel
- Backend → Render
- Database → Aiven

---

## Features

### For Users
- Sign up / log in securely (JWT auth)
- Browse and search stores by name or address
- Submit and update ratings for stores
- View store details with average rating

### For Store Owners
- Dashboard showing all ratings received
- View average rating and rating trends for their store

### For Admins
- Add, edit, or remove stores
- Manage users and assign roles
- View platform-wide statistics (total users, stores, ratings)

### General
- Role-based routing and access control
- Toast notifications for user feedback
- Skeleton loaders for smoother perceived performance
- Debounced search for efficient querying
- Fully responsive UI

---

## Architecture

```
┌─────────────┐        HTTPS/JSON        ┌──────────────┐        SSL        ┌─────────────┐
│   Frontend   │ ───────────────────────▶ │   Backend    │ ─────────────────▶ │   Database   │
│ React + Vite │ ◀─────────────────────── │ Node/Express │ ◀───────────────── │ MySQL (Aiven)│
│  (Vercel)    │        REST API          │  (Render)    │                    │              │
└─────────────┘                          └──────────────┘                    └─────────────┘
```

- **Frontend** communicates with the backend via REST API calls (Axios), using JWT tokens stored client-side for authenticated requests.
- **Backend** exposes REST endpoints, validates requests, checks user roles via middleware, and talks to MySQL for all data operations.
- **Database** stores three core entities: `users`, `stores`, and `ratings`, connected via foreign keys.

---

## Workflow

1. **Auth**: User signs up/logs in → backend validates credentials → issues a JWT → frontend stores it and attaches it to future requests.
2. **Role check**: Every protected route on the backend checks the JWT and the user's role (User / Store Owner / Admin) before allowing access.
3. **Browsing & rating**: Users fetch the store list (with search/filter), view a store's details, and submit a rating which updates that store's average.
4. **Store Owner view**: Store owners fetch ratings filtered to their own store(s) via a scoped API endpoint.
5. **Admin view**: Admins have access to CRUD endpoints for stores/users and an aggregated stats endpoint.

---

## Author

**Khushi Samundre**
