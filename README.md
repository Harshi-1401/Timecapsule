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

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, React Router, Axios, Tailwind CSS, React Hot Toast |
| Backend | FastAPI (Python), SQLAlchemy ORM, Pydantic |
| Database | SQLite (dev) — swappable to MySQL/PostgreSQL via `DATABASE_URL` |
| Auth | JWT (python-jose), bcrypt (passlib) |
| Email | Gmail SMTP (smtplib) |
| Scheduler | APScheduler (background job, every 1 min) |
| File Uploads | FastAPI `UploadFile`, stored in `uploads/` |

---

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

---

## Setup & Run

### Prerequisites
- Python 3.10+
- Node.js 18+
- Gmail account with [App Password](https://myaccount.google.com/apppasswords) (2-Step Verification required)

---

### Backend

```bash
cd python_backend

# Create and activate virtual environment
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # Mac/Linux

# Install dependencies
pip install -r requirements.txt

# Configure environment
# Edit .env with your values (see below)

# Start server
uvicorn main:app --reload
```

Backend runs at `http://localhost:8000`
Interactive API docs at `http://localhost:8000/docs`

#### `.env` configuration

```env
DATABASE_URL=sqlite:///./timecapsule.db

SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=60

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password-no-spaces
EMAIL_FROM=your-email@gmail.com
```

> **Gmail App Password:** Go to Google Account → Security → 2-Step Verification → App Passwords. Paste the 16-character password with **no spaces**.

---

### Frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs at `http://localhost:5173`

#### `client/.env`

```env
VITE_API_URL=http://localhost:8000/api
```

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| GET | `/api/auth/me` | Get current user |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile/` | Get logged-in user's profile |
| PUT | `/api/profile/` | Update name, email, profile image |

### Capsules
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/capsules/` | Create capsule (multipart) |
| GET | `/api/capsules/` | Get user's capsules |
| GET | `/api/capsules/public` | Get public unlocked capsules |
| GET | `/api/capsules/{id}` | Get single capsule |
| DELETE | `/api/capsules/{id}` | Delete capsule |
| POST | `/api/capsules/{id}/report` | Report capsule |

### Admin *(admin role required)*
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/stats` | System statistics |
| GET | `/api/admin/users` | List all users |
| PUT | `/api/admin/users/{id}` | Update user (ban/unban) |
| DELETE | `/api/admin/users/{id}` | Delete user |
| GET | `/api/admin/capsules` | List all capsules |
| DELETE | `/api/admin/capsules/{id}` | Delete capsule |

---

## How Capsule Unlocking Works

1. User creates a capsule with a future `unlock_date`
2. APScheduler runs `check_and_unlock_capsules()` every minute
3. When `unlock_date <= now`, the capsule is marked `is_unlocked = True`
4. A one-time email is sent to the owner via Gmail SMTP
5. `email_sent` flag is set to prevent duplicate emails

---

## Security

- Passwords hashed with bcrypt
- JWT tokens verified on every protected route via `Depends(get_current_user)`
- Email uniqueness enforced at DB and API level
- File type validated on upload
- CORS restricted to `http://localhost:5173`

---

## License

MIT

---

*Built with ❤️ for preserving digital memories*
