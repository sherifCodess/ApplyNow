# ApplyNow — Full-Stack Admissions Portal

ApplyNow is a full-stack admissions portal that allows students to register, submit admission applications, and track their application status. Admissions administrators can review submitted applications and approve or reject them.

The project combines a React frontend with a TypeScript/Express backend, PostgreSQL database, and Prisma ORM.

## Project Links

- **Frontend deployment:** https://apply-now-three.vercel.app
- **GitHub repository:** https://github.com/sherifCodess/ApplyNow

The deployment link refers to the frontend. A working production deployment is underway.

## Features

### Student

- Student registration and sign-in
- Password hashing with Argon2
- Email verification workflow
- Server-managed authentication sessions
- HTTP-only session cookies
- Multi-step application form:
  - Personal Information
  - Academic Information
  - Guardian Information
- Client-side and server-side input validation
- Application submission and confirmation
- Application status tracking
- Protected student routes

### Admissions Administration

- Protected administrative routes
- Application dashboard
- Application filtering by status
- Application details and review
- Approve and reject actions

### Engineering and Security

- REST API organized into authentication and application modules
- PostgreSQL persistence
- Prisma ORM and database migrations
- Zod request validation
- Helmet security headers
- CORS configuration
- API rate limiting
- Centralized API error handling
- Automated frontend and backend tests

## Technology Stack

| Area              | Technologies                               |
| ----------------- | ------------------------------------------ |
| Frontend          | React, Vite, Tailwind CSS                  |
| Routing           | React Router                               |
| State management  | React Context API                          |
| HTTP client       | Axios                                      |
| Backend           | Node.js, Express 5, TypeScript             |
| Database          | PostgreSQL                                 |
| ORM               | Prisma                                     |
| Validation        | Zod                                        |
| Password security | Argon2                                     |
| Authentication    | Server-managed sessions, HTTP-only cookies |
| Email             | SendByte                                   |
| Testing           | Vitest, React Testing Library, Supertest   |

## Architecture

```text
                React Frontend
                 (Vite :5173)
                      |
                 Axios API Client
                      |
                /api/v1 requests
                      |
               Express API Server
                 (Port 5000)
                      |
          +-----------+-----------+
          |                       |
    Authentication           Applications
       Module                   Module
          |                       |
          +-----------+-----------+
                      |
                Prisma ORM
                      |
                PostgreSQL
```

The frontend communicates with the backend through the `/api/v1` API prefix. During local development, Vite proxies these requests to the Express server.

The backend handles authentication, authorization, request validation, application workflows, and database operations.

## Application Routes

| Route                     | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| `/`                       | Admissions landing page                  |
| `/register`               | Student registration                     |
| `/login`                  | Student and administrator sign-in        |
| `/verify-email`           | Email verification                       |
| `/apply`                  | Multi-step application                   |
| `/confirmation`           | Application submission confirmation      |
| `/dashboard`              | Student dashboard and application status |
| `/admin`                  | Admissions administration dashboard      |
| `/admin/applications/:id` | Application details and review           |

## API Structure

The backend API uses the `/api/v1` prefix.

| API prefix             | Responsibility                                                         |
| ---------------------- | ---------------------------------------------------------------------- |
| `/api/v1/auth`         | Registration, login, email verification, session and logout operations |
| `/api/v1/applications` | Application submission, retrieval and administration workflows         |
| `/api/v1/health`       | API health check                                                       |

The API uses JSON request and response bodies. Authentication is maintained through server-managed sessions rather than client-managed authentication tokens.

## Getting Started

### Prerequisites

- Node.js and npm
- PostgreSQL
- Git

### 1. Clone the repository

```bash
git clone https://github.com/sherifCodess/ApplyNow.git
cd ApplyNow
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a local environment file from the example:

```bash
cp .env.example .env
```

Configure the variables in `.env`:

| Variable                  | Purpose                                         |
| ------------------------- | ----------------------------------------------- |
| `NODE_ENV`                | Backend environment                             |
| `PORT`                    | Backend server port                             |
| `CORS_ORIGIN`             | Allowed frontend origin                         |
| `RATE_LIMIT_WINDOW_MS`    | Rate-limiting time window                       |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests within the configured window   |
| `DATABASE_URL`            | PostgreSQL runtime connection                   |
| `MIGRATION_DATABASE_URL`  | PostgreSQL connection used by Prisma migrations |
| `SENDBYTE_API_KEY`        | SendByte API key                                |
| `EMAIL_FROM`              | Verified sender email address                   |
| `APP_BASE_URL`            | Frontend base URL used in verification links    |

For local development, configure the frontend origin as `http://localhost:5173` and the application base URL accordingly.

Both database connection variables must point to the intended PostgreSQL database. Keep actual credentials and API keys in `.env`; never commit this file.

### 4. Generate the Prisma client

```bash
npm run db:generate
```

### 5. Apply database migrations

After configuring PostgreSQL and the migration connection:

```bash
npm run db:migrate
```

Check migration status:

```bash
npm run db:status
```

Check database connectivity:

```bash
npm run db:check
```

### 6. Start the backend

In one terminal:

```bash
npm run server:dev
```

### 7. Start the frontend

In another terminal:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

The backend API runs on port `5000` in the local Vite proxy configuration.

## Available Scripts

| Command                    | Description                                |
| -------------------------- | ------------------------------------------ |
| `npm run dev`              | Start the Vite frontend development server |
| `npm run build`            | Build the frontend for production          |
| `npm run preview`          | Preview the production frontend build      |
| `npm run server:dev`       | Start the backend in development mode      |
| `npm run server:build`     | Compile the backend TypeScript             |
| `npm run server:typecheck` | Run backend TypeScript checks              |
| `npm run server:start`     | Start the compiled backend                 |
| `npm run server:test`      | Run the backend application test           |
| `npm run db:generate`      | Generate the Prisma client                 |
| `npm run db:migrate`       | Apply development database migrations      |
| `npm run db:check`         | Check database connectivity                |
| `npm run db:status`        | Check migration status                     |
| `npm test`                 | Start Vitest                               |

## Testing

The project uses Vitest for automated testing, React Testing Library for frontend component tests, and Supertest for backend HTTP tests.

Run all tests:

```bash
npx vitest run
```

Run backend tests:

```bash
npx vitest run backend/tests
```

The test suite covers authentication, registration, sessions, email verification, application workflows, form validation, dashboards, and application review.

## Production Builds

Build the frontend:

```bash
npm run build
```

Frontend build output is generated in `dist/`.

Compile the backend:

```bash
npm run server:build
```

Backend build output is generated in `dist-server/`.

Before deployment, configure production environment variables, database access, CORS origins, secure cookie settings, email delivery, and the backend hosting environment.

## Email Verification Configuration

ApplyNow includes an email verification workflow using SendByte.

Actual verification email delivery requires:

- A configured SendByte account
- A valid API key
- A verified sending domain
- A valid sender address configured through `EMAIL_FROM`
- The correct frontend URL configured through `APP_BASE_URL`

Email delivery is not operational until these requirements are configured. Registration and verification logic should not be mistaken for proof that email delivery is enabled.

## Project Structure

```text
ApplyNow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── lib/
│   │   ├── modules/
│   │   │   ├── applications/
│   │   │   └── auth/
│   │   ├── scripts/
│   │   ├── app.ts
│   │   └── server.ts
│   └── tests/
├── prisma/
│   ├── migrations/
│   └── schema.prisma
├── src/
│   ├── components/
│   ├── context/
│   ├── forms/
│   ├── pages/
│   ├── services/
│   ├── test/
│   └── utils/
├── .env.example
├── package.json
├── prisma.config.ts
├── tsconfig.server.json
├── vite.config.js
└── README.md
```

## Project Purpose

ApplyNow demonstrates full-stack software engineering practices through a practical admissions workflow. It brings together frontend development, REST API design, authentication, authorization, relational database management, validation, security controls, automated testing, and application lifecycle management.
