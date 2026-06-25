# Store Rating Platform

> A full-stack web application where users rate stores, owners track their reputation, and admins manage the platform.

---

## Overview

The Store Rating Platform provides a clean, role-based experience for three types of users. Customers can discover and rate stores, store owners get a real-time view of their ratings and reviewers, and admins have full control over users and platform data all secured with JWT authentication.

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Vite, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL |
| **Auth** | JWT + bcrypt |

---

## User Roles

| Role | Capabilities |
|---|---|
| **Admin** | Add users & stores, view platform-wide stats |
| **Normal User** | Browse stores, submit and update ratings |
| **Store Owner** | View store's average rating and list of raters |

---

## Setup & Installation

### Prerequisites
- Node.js v18+
- MySQL server running locally

### 1. Clone the repository

```bash
git clone <repo-url>
cd Store-Rating-Platform
```

### 2. Set up the database

```bash
mysql -u root -p < backend/schema.sql
```

### 3. Configure environment variables

Create a `.env` file inside the `backend/` folder:

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=store_rating_db
JWT_SECRET=any_random_secret
PORT=5000
```

> Never commit `.env` to version control. Add it to `.gitignore`.

### 4. Start the backend

```bash
cd backend
npm install
npm start
```

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open → **http://localhost:5173**

---

## Security

- Passwords hashed using **bcrypt** before storage
- All protected routes require a valid **JWT token**
- Role-based middleware ensures users can only access their permitted actions


---

## Author

**Khushi Samundre**  

---

*Solo-built end-to-end from schema design to JWT auth to React UI.*
