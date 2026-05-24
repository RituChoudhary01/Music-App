# 🎵 Music App — Full Stack Streaming Platform

A modern full-stack music streaming platform built with scalable microservice architecture, secure authentication, cloud deployment, and powerful media management features.

🚀 Live Demo:
http://15.135.219.153:3000/

---

# ✨ Features

- 🎧 Stream songs instantly
- 💿 Album management system
- ❤️ Create personal playlists
- 🔐 Secure JWT Authentication
- ☁️ AWS Cloud Deployment
- 📁 Media Upload Support
- ⚡ Redis caching
- 🗄️ MongoDB + PostgreSQL integration
- 📱 Responsive modern UI
- 🔥 RESTful API architecture

---

# 🛠️ Tech Stack

## Frontend
- React.js
- TypeScript
- Axios
- React Router
- Context API

## Backend
- Node.js
- Express.js
- JWT Authentication
- Multer File Upload

## Database & Cache
- MongoDB
- PostgreSQL
- Redis

## Cloud & DevOps
- AWS EC2
- PM2
- GitHub

---

# 🏗️ Project Structure

Music-App/
│
├── admin-service/
├── user-service/
├── song-service/
└── frontend/

---

# 🎵 Song Service APIs

## Album APIs

POST /album/new
GET /album/all
GET /album/:id
DELETE /album/:id

## Song APIs

POST /song/new
POST /song/:id
GET /song/all
GET /song/:id
DELETE /song/:id

---

# 👨‍💻 Admin Service APIs

## Protected Admin Routes

POST /album/new
POST /song/new
POST /song/:id
DELETE /album/:id
DELETE /song/:id

### Middleware Used

- isAuth
- uploadFile

---

# 👤 User Service APIs

## Authentication APIs

POST /user/register
POST /user/login
GET /user/me

## Playlist APIs

POST /song/:id

### Middleware Used

- isAuth

---

# 🔐 Authentication

This project uses JWT-based authentication.

Protected routes require:

Authorization: Bearer <token>

---

# ☁️ AWS Deployment

Application deployed on:

- AWS EC2


---

# ⚡ Redis Caching

Redis is used for:

- Faster API responses
- Session handling
- Performance optimization
- Reduced database load

---

# 🗄️ Database Design

## MongoDB
Used for:
- Songs
- Albums
- User playlists
- Media metadata

## PostgreSQL
Used for:
- Structured relational data
- Authentication records
- Transaction handling

---

# 🚀 Installation

## Clone Repository

git clone https://github.com/RituChoudhary01/Music-App.git

---

# 📦 Install Dependencies

## Frontend

cd frontend
npm install
npm run dev

## Admin Service

cd admin-service
npm install
npm run dev

## User Service

cd user-service
npm install
npm run dev

## Song Service

cd song-service
npm install
npm run dev

---

# 🔧 Environment Variables

Create `.env` file inside each service.

Example:

PORT=8000
MONGO_URI=your_mongodb_url
JWT_SECRET=your_secret
REDIS_URL=your_redis_url
DATABASE_URL=your_postgresql_url

---

# 📸 Application Highlights

- Dynamic album browsing
- Smooth audio playback
- Personalized playlists
- Responsive modern design
- Cloud-hosted scalable backend

---

# 🔥 Future Improvements

- AI music recommendations
- Real-time chat
- Premium subscriptions
- Audio waveform visualization
- Social sharing

---

# 👨‍💻 Author

Ritu Choudhary

Full Stack Developer passionate about scalable backend systems, cloud deployment, and modern web applications.

---

---

# 📄 License

This project is licensed under the MIT License.
