# Fullstack Open - Part 3 Phonebook

Deployed App: [https://fullstack-open-part3-phonebook.vercel.app/](https://fullstack-open-part3-phonebook.vercel.app/)

```
! THIS README.MD was created using CHATGPT.
The purpose is to present to the professor with other free deployment possibilities available.
```

---

## 🚀 Deployment to Vercel

This project contains both **frontend (React build in `dist/`)** and **backend (Express API)**.  
To deploy it successfully on **Vercel**, I had to make some changes so that the frontend and backend run together in a serverless environment.

---

### 1. Project structure

```
project-root/
  dist/              # frontend build output (React/Vite/etc.)
  api/
    index.js         # Vercel serverless function entry
  server.js          # Express app (API + static serving)
  vercel.json        # Vercel configuration
```

---

### 2. Express app (`server.js`)

- Serve static files from `dist/`
- Define API routes under `/api/*`
- Add a **base route** for React frontend (`/`)  
  (⚠️ needed to avoid the `path-to-regexp` error on Vercel)

```js
const express = require("express");
const path = require("path");

const app = express();

app.use(express.static(path.join(__dirname, "dist")));

// Example API route
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from API!" });
});

// Frontend Route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

module.exports = app;
```

---

### 3. Serverless entry (`api/index.js`)

Wrap the Express app so Vercel can run it as a serverless function:

```js
const app = require("../server");

module.exports = (req, res) => {
  app(req, res);
};
```

---

### 4. Vercel configuration (`vercel.json`)

Tell Vercel how to build and route requests:

```json
{
  "builds": [{ "src": "api/index.js", "use": "@vercel/node" }],
  "routes": [{ "src": "/(.*)", "dest": "api/index.js" }]
}
```

---

### 5. Build & Deploy

- Build frontend locally (`npm run build` → outputs to `dist/`)
- Commit and push changes
- Deploy to Vercel → it will run using the serverless setup

---

✅ With this setup:

- `/api/...` serves backend API endpoints
- `/` and other routes serve the React frontend from `dist/`

---

## 🛠 Tech Stack

- React (frontend, built into `dist/`)
- Express (backend API)
- Vercel (serverless deployment)
