# ApplyNow — Full-Stack Admissions Management System

ApplyNow is a full-stack admissions management platform designed to streamline student applications and administrative admissions workflows.

Students can register, authenticate, complete the email verification workflow, submit admission applications, and track their application statuses. Admissions administrators can access submitted applications, review applicant information, and manage application decisions through an administrative dashboard.

Built with React, Node.js, Express 5, TypeScript, PostgreSQL, and Prisma ORM, ApplyNow demonstrates practical software engineering through modular backend architecture, secure session-based authentication, role-based authorization, relational database management, request validation, security middleware, and automated testing.

## Project Links

- **Live Application:** https://apply-now-three.vercel.app
- **Backend API:** https://applynow-ovx3.onrender.com
- **Backend Health Check:** https://applynow-ovx3.onrender.com/api/v1/health
- **GitHub Repository:** https://github.com/sherifCodess/ApplyNow

## Production Deployment

The application is deployed using the following infrastructure:

| Component   | Technology                   | Hosting |
| ----------- | ---------------------------- | ------- |
| Frontend    | React, Vite                  | Vercel  |
| Backend API | Node.js, Express, TypeScript | Render  |
| Database    | PostgreSQL                   | Neon    |

The frontend communicates with the backend through a versioned REST API.

## Key Features

### Student Features

- Student registration and login.
- Secure password hashing using Argon2.
- Email verification workflow.
- Server-managed authentication sessions.
- HTTP-only session cookies.
- Multi-step admission application form.
- Personal, academic, and guardian information collection.
- Client-side and server-side validation.
- Application submission and confirmation.
- Application status tracking.
- Protected student routes.

### Admissions Administration

- Role-protected administrative access.
- Administrative application dashboard.
- Application filtering by status.
- Application details and review.
- Application approval and rejection.
- Protected administrative operations.

### Application Business Rules

ApplyNow enforces application eligibility rules to manage subsequent submissions:

- Students cannot submit another application while their previous application is awaiting a final administrative decision.
- Students can submit another application after their previous application has been approved.
- Students can reapply after their previous application has been rejected.

These rules are enforced through backend application logic and database constraints.

## Technology Stack

| Category          | Technologies                               |
| ----------------- | ------------------------------------------ |
| Frontend          | React 18, Vite, Tailwind CSS               |
| Languages         | JavaScript, TypeScript                     |
| Routing           | React Router                               |
| State Management  | React Context API                          |
| HTTP Client       | Axios                                      |
| Backend Runtime   | Node.js                                    |
| Backend Framework | Express 5                                  |
| Database          | PostgreSQL                                 |
| ORM               | Prisma 7                                   |
| Validation        | Zod                                        |
| Password Security | Argon2                                     |
| Authentication    | Server-managed sessions, HTTP-only cookies |
| Email Integration | SendByte                                   |
| Security          | Helmet, CORS, express-rate-limit           |
| Testing           | Vitest, React Testing Library, Supertest   |
| Development Tools | Git, GitHub                                |

## System Architecture

ApplyNow follows a modular full-stack architecture that separates frontend presentation, backend application logic, authentication, and database operations.

```text
             React Frontend
                (Vite)
                  |
                  |
             Axios API Client
                  |
                  |
             /api/v1 requests
                  |
                  |
             Express API
             (Port 5000)
                  |
          +-------+-------+
          |               |
     Authentication   Applications
        Module           Module
          |               |
     Auth Middleware  Application Services
          |               |
          +-------+-------+
                  |
                Prisma
                  |
              PostgreSQL
```

The backend is organized into dedicated modules, with separate responsibilities for routing, business logic, validation, authentication, and database access.

## Authentication and Security

ApplyNow uses server-managed sessions rather than client-managed JWT authentication.

The authentication system includes:

- Student registration and login.
- Argon2 password hashing.
- Email verification tokens.
- Session creation and validation.
- HTTP-only session cookies.
- Session expiration and logout.
- Authentication middleware.
- Role-based authorization.

The application defines three user roles:

- `STUDENT`
- `ADMISSIONS_ADMIN`
- `SUPER_ADMIN`

Additional security measures include:

- Protected API endpoints.
- Helmet security headers.
- CORS configuration.
- API rate limiting.
- Server-side request validation.
- Centralized error handling.

## API Overview

All backend endpoints use the `/api/v1` prefix.

| API Module             | Responsibility                                                  |
| ---------------------- | --------------------------------------------------------------- |
| `/api/v1/auth`         | Registration, login, email verification, sessions, and logout   |
| `/api/v1/applications` | Application submission, retrieval, and administrative workflows |
| `/api/v1/health`       | API health monitoring                                           |

The API uses JSON request and response bodies. Authentication is maintained through server-managed sessions.

## Database and Data Management

ApplyNow uses PostgreSQL for persistent relational data storage and Prisma ORM for database access.

Database management includes:

- Prisma schema definition.
- Version-controlled database migrations.
- Prisma Client generation.
- Runtime database connectivity checks.
- Migration status verification.
- Database-level application eligibility constraints.

The data model includes user accounts, authentication sessions, email verification tokens, and admission applications.

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
│       ├── app.test.ts
│       └── auth/
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

## Getting Started

### Prerequisites

- Node.js
- npm
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

Create a local environment file:

```bash
cp .env.example .env
```

Configure the following variables:

| Variable                  | Purpose                                       |
| ------------------------- | --------------------------------------------- |
| `NODE_ENV`                | Backend environment                           |
| `PORT`                    | Backend server port                           |
| `CORS_ORIGIN`             | Allowed frontend origin                       |
| `RATE_LIMIT_WINDOW_MS`    | Rate-limiting time window                     |
| `RATE_LIMIT_MAX_REQUESTS` | Maximum requests within the configured window |
| `DATABASE_URL`            | PostgreSQL runtime connection                 |
| `MIGRATION_DATABASE_URL`  | PostgreSQL migration connection               |
| `SENDBYTE_API_KEY`        | SendByte API key                              |
| `EMAIL_FROM`              | Verified sender email address                 |
| `APP_BASE_URL`            | Frontend URL used in verification links       |

For local development, configure:

```env
NODE_ENV=development
PORT=5000
CORS_ORIGIN=http://localhost:5173
APP_BASE_URL=http://localhost:5173
```

Configure your PostgreSQL connection strings and other required values in `.env`.

Never commit actual credentials, database passwords, or API keys.

### 4. Generate Prisma Client

```bash
npm run db:generate
```

### 5. Apply database migrations

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

```bash
npm run server:dev
```

The backend runs on port `5000` by default.

### 7. Start the frontend

Open another terminal:

```bash
npm run dev
```

Open the application:

http://localhost:5173

## Available Scripts

| Command                    | Description                       |
| -------------------------- | --------------------------------- |
| `npm run dev`              | Start frontend development server |
| `npm run build`            | Build frontend for production     |
| `npm run preview`          | Preview frontend production build |
| `npm run server:dev`       | Start backend in development mode |
| `npm run server:build`     | Compile backend TypeScript        |
| `npm run server:typecheck` | Run backend type checking         |
| `npm run server:start`     | Start compiled backend            |
| `npm run server:test`      | Run backend application test      |
| `npm run db:generate`      | Generate Prisma Client            |
| `npm run db:migrate`       | Apply development migrations      |
| `npm run db:check`         | Check database connectivity       |
| `npm run db:status`        | Check migration status            |
| `npx vitest run`           | Run all automated tests           |

## Testing

ApplyNow uses:

- **Vitest** for automated testing.
- **React Testing Library** for frontend component testing.
- **Supertest** for backend HTTP testing.

Run the complete test suite:

```bash
npx vitest run
```

Run backend tests:

```bash
npx vitest run backend/tests
```

Run frontend tests:

```bash
npx vitest run src/test
```

Run backend type checking:

```bash
npm run server:typecheck
```

The automated tests cover frontend application workflows, form validation, authentication, registration, password handling, sessions, email verification, and authorization middleware.

## Email Verification Configuration

ApplyNow includes an email verification workflow with SendByte integration.

The verification logic and email integration are implemented, but production email delivery requires external provider configuration.

To enable delivery, configure:

- A SendByte account.
- A valid `SENDBYTE_API_KEY`.
- A verified sending domain.
- A configured `EMAIL_FROM` sender address.
- The correct `APP_BASE_URL`.

Actual email delivery depends on successful provider configuration.

## Project Purpose

ApplyNow demonstrates practical full-stack software engineering through the development of an admissions management platform.

It brings together frontend development, backend architecture, REST API design, authentication, authorization, relational database management, security controls, business logic, and automated testing.

The project reflects the engineering considerations involved in designing, implementing, and maintaining a full-stack web application.
