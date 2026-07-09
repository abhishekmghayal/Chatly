# 💬 Chatly

> Real-time messaging with audio/video calls, screen sharing, and media uploads — built with React, Node.js, Socket.IO, and WebRTC.

![Node.js](https://img.shields.io/badge/Node.js-v16+-339933?logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/React-Vite-61DAFB?logo=react&logoColor=white)
![Socket.IO](https://img.shields.io/badge/Socket.IO-Realtime-010101?logo=socket.io)
![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-blue)

---

## Features

- **Real-time messaging** — Instant delivery via Socket.IO with conversation threads
- **Authentication** — JWT-based login with protected routes
- **Audio & video calls** — Peer-to-peer one-on-one and group calls via WebRTC
- **Screen sharing** — Share your screen during any call
- **Media uploads** — Images and files stored on Cloudinary
- **State management** — Redux slices for auth, conversations, messages, and socket state

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Redux Toolkit |
| Backend | Node.js, Express |
| Real-time | Socket.IO, WebRTC |
| Database | MongoDB (Mongoose) |
| Auth | JWT |
| Media | Cloudinary |

---

## Project Structure

```
├── backend/
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # Express routes (users, messages, conversations)
│   └── socket/            # Socket.IO & WebRTC signaling logic
│
└── frontend/
    ├── components/        # React UI components
    └── store/             # Redux slices (auth, conversations, messages, socket)
```

---

## Getting Started

### Prerequisites

- Node.js v16+
- npm or yarn
- MongoDB instance (local or [MongoDB Atlas](https://www.mongodb.com/atlas))
- [Cloudinary](https://cloudinary.com/) account

### 1. Clone the repository

```bash
git clone https://github.com/your-username/chatapp.git
cd chatapp
```

### 2. Set up environment variables

Create a `.env` file inside `backend/`:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
CLOUDINARY_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

> ⚠️ Never commit this file. It's already in `.gitignore`.

### 3. Install dependencies

```bash
# Backend
cd backend && npm install

# Frontend
cd ../frontend && npm install
```

### 4. Run in development

```bash
# Backend (from /backend)
npm run dev

# Frontend (from /frontend)
npm run dev
```

The frontend runs at `http://localhost:5173` and the backend at `http://localhost:5000` by default.

---

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and get JWT |
| GET | `/api/conversations` | Fetch user's conversations |
| POST | `/api/messages` | Send a message |
| GET | `/api/messages/:conversationId` | Get messages in a conversation |

> Full API documentation coming soon.

---

## Socket Events

| Event | Direction | Description |
|---|---|---|
| `sendMessage` | Client → Server | Send a new message |
| `receiveMessage` | Server → Client | Receive a new message |
| `callUser` | Client → Server | Initiate a WebRTC call |
| `callAccepted` | Server → Client | Call accepted signal |
| `screenShare` | Client → Server | Start screen sharing |

---

## Deployment

### Backend

Deploy to [Render](https://render.com), [Railway](https://railway.app), or [Heroku](https://heroku.com):

1. Set all environment variables in the platform's dashboard.
2. Set the start command to `npm start`.

### Frontend

Deploy to [Vercel](https://vercel.com) or [Netlify](https://netlify.com):

1. Set the build command to `npm run build` and output directory to `dist`.
2. Add an environment variable pointing to your deployed backend URL (e.g., `VITE_API_URL`).

---

## Running Tests

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

---

## Security

- `.env` files and secrets must never be committed
- `JWT_SECRET` should be a long, random string
- `node_modules/` and `.env` are excluded via `.gitignore`
- All API routes that require authentication are protected with JWT middleware

---

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m "Add my feature"`
4. Push and open a pull request

Please follow existing code style and include tests for any new logic.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

Built by [Sagar Afar](https://github.com/Sagardevil). Feel free to open an issue or reach out for questions.
