# TimeCapsule - Digital Memory Locker 🕰️

A full-stack MERN application that allows users to create digital time capsules with text, images, videos, and audio that unlock automatically on a future date.

## Features

- 🔐 Secure JWT authentication
- 📝 Create capsules with text, images, videos, and audio
- 🔒 Optional AES-256 encryption for sensitive content
- ⏰ Automatic unlocking via scheduled cron jobs
- 📧 Email notifications when capsules unlock
- 🌍 Public capsule sharing
- 📱 Responsive modern UI with Tailwind CSS
- ⏳ Countdown timers for locked capsules
- 👥 **Admin Panel** - Comprehensive user and capsule management
- 📊 **System Statistics** - Real-time analytics and trends
- 🛡️ **Content Moderation** - Report and review system

## Tech Stack

**Frontend:**
- React 18
- React Router
- Axios
- Tailwind CSS
- React Hot Toast

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcrypt
- Multer (file uploads)
- node-cron (scheduled jobs)
- Nodemailer (email notifications)
- crypto (encryption)

## Project Structure

```
timecapsule/
├── server/              # Backend
│   ├── config/          # Configuration files
│   ├── controllers/     # Route controllers
│   ├── middleware/      # Auth & validation middleware
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── utils/           # Utilities (encryption, email)
│   ├── uploads/         # Uploaded files
│   └── server.js        # Entry point
└── client/              # Frontend
    ├── src/
    │   ├── components/  # React components
    │   ├── pages/       # Page components
    │   ├── services/    # API services
    │   ├── context/     # Auth context
    │   └── App.jsx      # Main app
    └── package.json
```

## Setup Instructions

### 🚀 Quick Start

**👉 New to TimeCapsule? Start here: [START_HERE.md](START_HERE.md)** ⭐

**Or jump directly to:**
- **[Getting Started Guide](GETTING_STARTED.md)** - 15-minute setup
- **[MongoDB Atlas Setup](MONGODB_ATLAS_SETUP.md)** - Cloud database setup
- **[Windows Setup](WINDOWS_SETUP.md)** - Windows-specific guide

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (free tier) - [Setup Guide](MONGODB_ATLAS_SETUP.md)
- SMTP email account (Gmail recommended)

### Backend Setup

1. Navigate to server directory:
```bash
cd server
npm install
```

2. Create `.env` file:
```env
PORT=5000
MONGO_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/timecapsule?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key_change_this
ENCRYPTION_KEY=your_32_character_encryption_key_here_change_this
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
CLIENT_URL=http://localhost:5173
```

**📘 Need help with MongoDB Atlas?** See [MongoDB Atlas Setup Guide](MONGODB_ATLAS_SETUP.md)

3. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
npm install
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

3. Start development server:
```bash
npm run dev
```

### Gmail SMTP Setup

1. Enable 2-factor authentication on your Gmail account
2. Generate an App Password: Google Account → Security → 2-Step Verification → App passwords
3. Use the generated password in `EMAIL_PASS`

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Capsules
- `POST /api/capsules` - Create capsule
- `GET /api/capsules` - Get user's capsules
- `GET /api/capsules/public` - Get public unlocked capsules
- `GET /api/capsules/:id` - Get single capsule
- `DELETE /api/capsules/:id` - Delete capsule
- `POST /api/capsules/:id/report` - Report capsule

### Admin (Requires Admin Role)
- `POST /api/admin/create-admin` - Create first admin user
- `GET /api/admin/stats` - Get system statistics
- `GET /api/admin/users` - Get all users (with pagination)
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user (ban/unban/reset password)
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/capsules` - Get all capsules (with filters)
- `DELETE /api/admin/capsules/:id` - Delete capsule
- `PUT /api/admin/capsules/:id/review` - Mark capsule as reviewed

For detailed admin panel documentation, see [ADMIN_PANEL_GUIDE.md](ADMIN_PANEL_GUIDE.md)

## Environment Variables

### Server (.env)
- `PORT` - Server port (default: 5000)
- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Secret key for JWT tokens
- `ENCRYPTION_KEY` - 32-character key for AES-256 encryption
- `ADMIN_SECRET` - Secret key for creating first admin user
- `EMAIL_HOST` - SMTP host
- `EMAIL_PORT` - SMTP port
- `EMAIL_USER` - Email username
- `EMAIL_PASS` - Email password
- `CLIENT_URL` - Frontend URL for CORS

### Client (.env)
- `VITE_API_URL` - Backend API URL

## Features Explained

### Encryption
When creating a capsule, users can enable encryption. The content is encrypted using AES-256-CBC before storage and decrypted only when unlocked.

### Scheduled Unlocking
A cron job runs every minute checking for capsules that should be unlocked. When found, it:
1. Marks the capsule as unlocked
2. Sends email notification to the owner
3. Makes it visible if public

### File Uploads
Supports images (jpg, png, gif), videos (mp4, avi, mov), and audio (mp3, wav, ogg) up to 50MB.

## Security Features

- Password hashing with bcrypt (10 rounds)
- JWT token authentication
- Protected API routes
- Input validation
- File type validation
- User-specific capsule access
- Secure encryption key storage

## Production Deployment

1. Set `NODE_ENV=production`
2. Use MongoDB Atlas for database
3. Configure proper CORS origins
4. Use environment variables for all secrets
5. Enable HTTPS
6. Consider using PM2 for process management
7. Set up proper logging

## 📚 Documentation

**📖 [Complete Documentation Index](DOCUMENTATION_INDEX.md)** - Find everything you need

### 🚀 Getting Started
- **[Getting Started](GETTING_STARTED.md)** - ⭐ Complete beginner guide (15 minutes)
- **[Windows Setup](WINDOWS_SETUP.md)** - 🪟 Windows-specific instructions
- **[MongoDB Atlas Setup](MONGODB_ATLAS_SETUP.md)** - ☁️ Cloud database setup
- **[What Changed](MONGODB_ATLAS_CHANGES.md)** - MongoDB Atlas migration summary

### 📖 Guides & References
- **[Setup Guide](SETUP_GUIDE.md)** - Detailed installation instructions
- **[API Documentation](API_DOCUMENTATION.md)** - Complete API reference
- **[Quick Reference](QUICK_REFERENCE.md)** - Developer quick reference
- **[Testing Guide](TESTING_GUIDE.md)** - Comprehensive testing guide

### 🏗️ Architecture & Deployment
- **[Architecture](ARCHITECTURE.md)** - System design and architecture
- **[Features](FEATURES.md)** - Complete feature list (150+)
- **[Deployment](DEPLOYMENT.md)** - Production deployment guide
- **[Project Summary](PROJECT_SUMMARY.md)** - Complete project overview


## License

MIT

## Author

Built with ❤️ for preserving digital memories
