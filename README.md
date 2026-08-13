# ApplyNow — Admissions Portal

A multi-step admissions portal built with React, Tailwind CSS, React Router,
Axios, and JSON Server. Applicants submit personal, academic, and guardian
information and track their status; admission officers review, approve, or
reject submitted applications.

## Stack

- **React** + **Vite**
- **Tailwind CSS** for styling
- **React Router** for navigation (`/`, `/apply`, `/confirmation`, `/dashboard`, `/admin`, `/admin/applications/:id`)
- **Context API** (`ApplicationContext`) for multi-step form state
- **Axios** + **JSON Server** for the mock backend

## Getting started

Install dependencies:

```bash
npm install
```

Run the mock API (JSON Server, port 4000) and the frontend (Vite, port 5173)
in two terminals:

```bash
npm run server
npm run dev
```

Then open http://localhost:5173.

## How it works

- **Apply** (`/apply`) — a three-step form (Personal → Academic → Guardian).
  Data for all steps lives in one shared object in `ApplicationContext`, so
  moving Back and Next never loses what you typed. Each step is validated
  before you can advance; the final step submits via `POST /applications`.
- **Confirmation** (`/confirmation`) — shown right after a successful submit,
  with the generated application ID.
- **My Status** (`/dashboard`) — looks up the applicant's own application
  (`GET /applications/:id`) and shows its live status.
- **Admin** (`/admin`) — lists all applications (`GET /applications`) with a
  status filter. Selecting one opens **Application Details**
  (`/admin/applications/:id`), where an officer can Approve or Reject
  (`PATCH /applications/:id`). The status change is immediately visible on
  the applicant's dashboard.

## Notes

- If JSON Server isn't running, the UI shows a friendly error banner instead
  of breaking, with a Retry action where relevant.
- The app is responsive from mobile through desktop.
- There's no auth layer (out of scope for this project) — the applicant
  dashboard remembers the most recent application ID submitted from that
  browser via `localStorage`.

## Deployment

Deploy the frontend to **Vercel** or **Netlify**. JSON Server is a local mock
API for development — for a real deployment, point `src/services/api.js` at
a hosted API instead.
