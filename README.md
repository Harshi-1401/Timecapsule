# TimeCapsule 🕰️ — Digital Memory Locker

A full-stack web application where users can create digital time capsules containing text, images, videos, and audio that automatically unlock on a future date — with email notifications on unlock.

---

## Features

- 🔐 JWT authentication (signup, login, protected routes)
- 👤 User profile — view and edit name, email, profile image
- 📝 Create capsules with text + optional media (image/video/audio/file)
- ⏰ Automatic unlocking via background scheduler (runs every minute)
- 📧 Email notification when a capsule unlocks (Gmail SMTP)
- 🌍 Public capsule sharing
- 🏠 Collaborative rooms with task management
- 🛡️ Admin panel — manage users and capsules
- 📱 Responsive UI with Tailwind CSS

## Project Structure

```
TimeCapsule/
├── client/                  # React frontend
│   ├── src/
│   │   ├── components/      # Navbar, ProfileDropdown, etc.
│   │   ├── context/         # AuthContext (JWT state)
│   │   ├── pages/           # Dashboard, Profile, Login, etc.
│   │   └── services/        # api.js (Axios instance + API calls)
│   └── package.json
│
└── python_backend/          # FastAPI backend
    ├── database/db.py       # SQLAlchemy engine + session
    ├── models/              # ORM models (User, Capsule, Room, Task)
    ├── schemas/             # Pydantic schemas (validation)
    ├── routes/              # auth, capsules, profile, rooms, tasks, admin
    ├── utils/               # auth.py (JWT/bcrypt), email.py, scheduler.py
    ├── uploads/             # Uploaded media files
    ├── main.py              # FastAPI app entry point
    ├── requirements.txt
    └── .env
```
