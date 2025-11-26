# Attendify 

Attendify is a student attendance platform that combines secure authentication, rich student profiles, and a landing page targeted at showcasing its capabilities. This repo contains the Express/MongoDB backend plus the EJS views that render the landing experience and logged-in dashboard.

## Key Features
- **Landing Page CTA flow** – Smooth-scroll navigation across sections (`Home`, `Features`, `How it Works`, `Contact`). Visitors can preview the product before creating an account.
- **Student Sign-up with Course & Photo** – Students register with their roll number, course, section, and a mandatory profile image. Validation ensures no one signs up without providing the required data.
- **Secure Authentication** – Passport-local handles student credentials, hashing passwords and managing sessions.
- **Personalized Dashboard** – After login, users see their timetable, profile information, and uploaded avatar, alongside logout controls.
- **Static Upload Serving** – Multer stores photos inside `public/uploads`, and Express exposes them at `/uploads/<filename>` so profile images work instantly.

## Architecture Overview

| Area | Technology | Purpose |
|------|------------|---------|
| Web framework | **Express.js** | Routes HTTP requests, mounts feature modules, serves static assets. |
| Templates | **EJS** | Server-rendered UI for landing, signup, login, and student dashboard views. |
| Database | **MongoDB + Mongoose** | Persists users, sections, and timetables; Mongoose schemas enforce structure. |
| Auth | **passport-local-mongoose** | Hashes passwords, adds helper methods like `User.register`, handles session serialization. |
| File uploads | **Multer** | Accepts student profile photos, stores them in `public/uploads`, performs MIME filtering. |
| Sessions | **express-session** | Stores Passport session IDs; required for persistent login state. |
| Styling | **Tailwind CSS** | Utility classes drive modern, responsive layout across EJS views. |

## Request Flow
1. **Landing visit** – `/landing` renders `views/landing.ejs`, which pulls in `partials/navbar.ejs` for navigation. Smooth scrolling is handled client-side.
2. **Signup (`GET /signup`)** – Renders `views/signup.ejs` with an empty `formData` object so validation errors can re-populate fields.
3. **Signup (`POST /signup`)** – `routes/api/auth.js` runs `uploadPhoto` (Multer) to enforce image uploads, validates course input, then creates a new `User` via `User.register`. Successful signups redirect to `/login`.
4. **Login (`POST /login`)** – Passport authenticates credentials. After success, the student’s section is fetched and `profile.ejs` renders their timetable plus photo.
5. **Profile assets** – Uploaded images are requested directly from `/uploads/<filename>` thanks to `express.static` and the path stored in `user.photo`.

## File Guide
- `app.js` – Express bootstrapping, middleware, static serving, route mounting, and MongoDB connection.
- `routes/api/auth.js` – Signup, login, logout, image upload, and session-driven profile rendering.
- `routes/api/landing.js` – Handles the landing page route.
- `views/partials/*` – Shared UI (navigation, footer) used across pages.
- `views/signup.ejs`, `views/login.ejs`, `views/profile.ejs`, `views/landing.ejs` – Main page templates.
- `Model/User.js`, `Model/Section.js`, `Model/Class.js` – Mongoose schemas for users, sections, and classes.
- `public/uploads/` – Runtime directory for uploaded student photos.

## Running Locally
1. **Install dependencies**
   ```bash
   npm install
   ```
2. **Start MongoDB** (ensure `mongodb://127.0.0.1:27017/attendify` is reachable).
3. **Seed optional data** (uncomment `seedSections()` / `seedSimpleUsers()` in `app.js` as needed).
4. **Launch the server**
   ```bash
   npm start
   ```
5. Visit `http://localhost:8080/landing` to explore the marketing site or go straight to `/signup` to create a student account.

## Future Enhancements
- Role-based dashboards (teacher/admin) to complement the student experience.
- API endpoints for attendance analytics and export.
- Client-side validation for faster feedback before form submission.

Feel free to open issues or contribute improvements to keep Attendify evolving! 

