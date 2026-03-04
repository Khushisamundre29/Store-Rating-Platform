# ⭐ Store Rating Platform

A full-stack web app where users can rate stores, store owners can track their ratings, and admins manage the platform.

---

## 🛠️ Tech Stack

- **Frontend** — React.js, Vite, Axios
- **Backend** — Node.js, Express.js
- **Database** — MySQL
- **Auth** — JWT + bcrypt

---

## 👤 User Roles

| Role | What they can do |
|------|-----------------|
| **Admin** | Add users & stores, view platform stats |
| **Normal User** | Browse stores, submit & update ratings |
| **Store Owner** | View their store's average rating and raters |

---

## ⚙️ How to Run

### 1. Clone the repo
```bash
git clone url (The url you have to copy)
cd Store-Rating-Platform
```

### 2. Set up the database
```bash
mysql -u root -p < backend/schema.sql
```
### 3. Create `backend/.env`
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=store_rating_db
JWT_SECRET=any_random_secret
PORT=5000
```

### 4. Run backend
```bash
cd backend && npm install && npm start
```

### 5. Run frontend
```bash
cd frontend && npm install && npm run dev
```

Open → **http://localhost:5173**

---

## 👩‍💻 Author

**Khushi Samundre**

> Built as part of a Full Stack Intern Coding Challenge.
