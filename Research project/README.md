# TaskFlow

A Next.js 15 App Router task manager using **NextAuth.js / Auth.js credentials** for authentication and **Mongoose with MongoDB** for data. The advanced feature chosen for this build is a three-column task board with native drag-and-drop between `To do`, `In progress`, and `Done`.

## Run locally

1. Install Node.js and MongoDB Community Server. Start the MongoDB service.
2. In this folder, create `.env.local` from `.env.example` and set a private random `AUTH_SECRET`.
3. Install packages and start Next.js:

   ```bash
   npm install
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000), create an account, and add tasks.

The MongoDB URI can point to a local database, for example `mongodb://127.0.0.1:27017/taskflow`, or to a MongoDB Atlas cluster. Never commit `.env.local`.

## Included

- Public home, register, and login pages; authenticated dashboard.
- Passwords hashed with bcrypt before storage. NextAuth issues JWT sessions.
- Mongoose `User` and `Task` models. Each task is scoped to its owner.
- Protected task API: `GET/POST /api/tasks` and `GET/PUT/DELETE /api/tasks/[id]`.
- Create, edit, delete, search, and drag tasks between statuses.
- Request validation, loading feedback, and API error messages.
- Tailwind CSS styling.

## Research selections

- **Day 1 authentication:** NextAuth.js v5 (Auth.js) with email/password credentials and a custom MongoDB-backed registration flow. OAuth providers can be added later by configuring a provider and its credentials.
- **Day 2 data layer:** Mongoose models and MongoDB.
- **Day 4 advanced feature:** Drag-and-drop task board.

## Deployment

Deploy the project to Vercel after pushing it to GitHub. Add `MONGODB_URI`, `AUTH_SECRET`, and `AUTH_TRUST_HOST=true` to the Vercel project's environment variables. Use a reachable MongoDB Atlas URI for a Vercel deployment; `localhost` refers to the Vercel runtime, not your computer. Then deploy and verify register, sign-in, and task CRUD on the production URL.
