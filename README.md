# MERN Blog — Full-Stack Integration Project


## 🖼️ Application Screenshot

![App Screenshot](public/screenshot.png)


## Project overview
A full-stack MERN (MongoDB, Express, React, Node) blog application demonstrating end-to-end integration between front-end and back-end, including:
- RESTful API for posts and categories
- React client with routing, forms, and state management
- Mongoose models with relationships
- Validation, error handling, authentication, and image upload
- Advanced features: pagination, search/filter, optimistic UI, comments (optional)

This repository contains two main folders:
- `server/` — Express API, Mongoose models, authentication, file uploads
- `client/` — React app (Vite), API service, routes, components

## Tech stack
- Node.js (v18+)
- Express.js
- MongoDB (+ Mongoose)
- React (Vite)
- React Router
- axios (client HTTP)
- multer (file uploads)
- jsonwebtoken / bcryptjs (auth)
- joi or express-validator (validation)
- Optional: Cloud storage SDK (S3, Cloudinary) for images

## Getting started — Setup instructions

Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Git

Clone
PowerShell / Command Prompt:
```powershell
git clone <repo-url>
cd c:\Users\HP\documents\mern-stack-integration-4tunek
```

Server setup
```powershell
cd server
npm install
# create .env based on .env.example
# Example .env values:
# PORT=5000
# MONGO_URI=mongodb://localhost:27017/mern-blog
# JWT_SECRET=your_jwt_secret
# CLIENT_URL=http://localhost:5173
npm run dev   # starts server with nodemon
```

Client setup
```powershell
cd client
npm install
# create .env based on .env.example
# Example .env values:
# VITE_API_URL=http://localhost:5000/api
npm run dev   # starts Vite dev server (default port 5173)
```

Run both concurrently (optional)
- Use two terminals or a tool like `concurrently`:
```powershell
# from repo root (if configured)
npm run dev:all
```

Build for production
```powershell
# client
cd client
npm run build

# server - ensure production env vars and serve static client build from server/public (optional)
```

Testing
- Unit / integration tests (if included) can be run with:
```powershell
cd server
npm test

cd client
npm test
```

## Environment variables (examples)
server/.env:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mern-blog
JWT_SECRET=replace_with_secure_secret
CLIENT_URL=http://localhost:5173
UPLOAD_DIR=uploads
```

client/.env:
```
VITE_API_URL=http://localhost:5000/api
```

## API documentation

Base URL: http://localhost:5000/api

Authentication
- POST /api/auth/register
  - Body: { "name": "string", "email": "string", "password": "string" }
  - Response: { "user": { id, name, email }, "token": "jwt" }

- POST /api/auth/login
  - Body: { "email", "password" }
  - Response: { "user": {...}, "token": "jwt" }

Protected routes: include `Authorization: Bearer <token>` header.

Posts
- GET /api/posts
  - Query params: page, limit, search, category, sort
  - Response: { "data": [...posts], "meta": { page, limit, total } }

- GET /api/posts/:id
  - Response: { "data": { post } }

- POST /api/posts (protected)
  - Content-Type: multipart/form-data (if image), or application/json
  - Body example: { "title": "string", "body": "string", "category": "categoryId", "tags": ["x"], "featuredImage": file }
  - Response: { "data": { post } }
  - Validation: title required, body required, category must exist

- PUT /api/posts/:id (protected, owner or admin)
  - Body similar to POST
  - Response: updated post

- DELETE /api/posts/:id (protected, owner or admin)
  - Response: success message

Categories
- GET /api/categories
  - Response: [ { id, name, slug } ]

- POST /api/categories (protected)
  - Body: { "name": "string" }
  - Response: created category

Comments (optional)
- POST /api/posts/:id/comments (protected)
  - Body: { "text": "string" }
  - Response: comment created

Image uploads
- Upload via POST /api/upload or multipart/form-data on /api/posts endpoints
- Stored locally under `server/uploads` or sent to cloud storage

Validation & errors
- API returns 4xx with { message: "validation or auth message", errors?: [...] }
- Error-handling middleware returns consistent JSON responses and proper HTTP status codes

Example curl: create post (with token)
```bash
curl -X POST "http://localhost:5000/api/posts" \
 -H "Authorization: Bearer <token>" \
 -H "Content-Type: application/json" \
 -d '{"title":"Hello","body":"Content","category":"<catId>"}'
```

Example response (GET /api/posts)
```json
{
  "data": [
    {
      "_id": "64a...",
      "title": "First post",
      "body": "Post body",
      "category": { "_id": "c1", "name": "General" },
      "author": { "_id": "u1", "name": "Admin" },
      "featuredImage": "/uploads/abc.jpg",
      "createdAt": "2025-11-12T..."
    }
  ],
  "meta": { "page": 1, "limit": 10, "total": 42 }
}
```

## Models (summary)
- User: { name, email, passwordHash, role }
- Category: { name, slug }
- Post: { title, body, category: ObjectId, author: ObjectId, tags[], featuredImage, comments[] }
- Comment: { author: ObjectId, text, createdAt }

## Features implemented (per assignment)
- Project scaffolding: separate client and server folders
- MongoDB + Mongoose connection
- Express server with middleware (cors, helmet, body-parser)
- RESTful endpoints for posts and categories (CRUD)
- Mongoose models with relationships
- Input validation (Joi / express-validator)
- Error handling middleware
- React client using Vite, React Router, and hooks
- Components: posts list, single post view, create/edit form, navigation
- API service layer in client (custom hook for API calls)
- State management using useContext + useReducer (or local state)
- Image upload support (multipart/form-data)
- Authentication (register, login, protected routes)
- Pagination, search and filtering on posts
- Optimistic UI updates for create/edit/delete flows
- Loading and error states in the client
- Optional: comments feature

## Folder structure (recommended)
```
/client
  /src
    /components
    /pages
    /hooks
    /services
    main.jsx
/server
  /controllers
  /models
  /routes
  /middleware
  /utils
  server.js
.env.example
```

## Deployment notes
- Build client (Vite) and serve static build from Express (e.g., serve `client/dist`).
- Use environment variables for DB and JWT secrets.
- Use cloud storage (S3/Cloudinary) for production image hosting.
- Configure HTTPS and secure JWT secret.

## Screenshots
Place screenshots under `/docs/screenshots` and reference them here:
- docs/screenshots/home.png
- docs/screenshots/post-create.png

## Contribution
- Follow feature branches and PR workflow
- Linting and formatting via ESLint / Prettier
- Add tests for API and components

## Troubleshooting
- Mongo connection errors: verify `MONGO_URI` and Mongo server status
- CORS errors: ensure `CLIENT_URL` is allowed in server CORS config
- Auth errors: confirm token is sent in Authorization header

## License
Specify project license (e.g., MIT).

----
Add or update screenshots, .env.example files, and API contract docs as implementation evolves.