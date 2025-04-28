🛣️ How to Approach It

Phase 1: Setup Environment
	•	Initialize NestJS app
	•	Add Dockerfile & docker-compose
	•	Set up Postgres container
	•	Add Prisma, create schema

Phase 2: Auth Flow
	•	Register/Login using cookies
	•	Secure routes using AuthGuard
	•	Add roles (USER/ADMIN)

Phase 3: Features
	•	Post CRUD
	•	Comments on posts
	•	Likes
	•	Tags with many-to-many relations
	•	Use Prisma query builder (prisma.$queryRaw) to experiment

Phase 4: Validation & Middleware
	•	Add Zod validation
	•	Centralized error handling
	•	Logging, guards, interceptors



	🧠 Key APIs

Auth
	•	POST /auth/register
	•	POST /auth/login
	•	POST /auth/logout
	•	GET /auth/me (Check user session)

Users
	•	GET /users/:id
	•	GET /users (admin only)

Posts
	•	GET /posts
	•	GET /posts/:id
	•	POST /posts
	•	PUT /posts/:id
	•	DELETE /posts/:id

Comments
	•	POST /posts/:id/comments
	•	DELETE /comments/:id

Likes
	•	POST /posts/:id/like
	•	DELETE /posts/:id/like

Tags
	•	GET /tags
	•	POST /tags (admin only)