# ApplyNow — Admissions Portal

ApplyNow is a responsive admissions portal built for a frontend internship project. It allows applicants to complete a three-step application, receive a submission confirmation, track application status, and provides an admissions-office interface for reviewing and approving or rejecting applications.

## Live Project

**Live frontend:** https://apply-now-three.vercel.app

**GitHub repository:** https://github.com/sherifCodess/ApplyNow

## Features

- Responsive admissions landing page
- Three-step application flow:
  - Personal Information
  - Academic Information
  - Guardian Information
- Client-side validation for required fields, email, phone, graduation year, and GPA
- Persistent multi-step form state using React Context
- Application confirmation with generated application ID
- Applicant status dashboard
- Admin application dashboard
- Application filtering by Pending, Approved, and Rejected
- Application details/review page
- Approve and Reject actions
- Loading, empty, and error states
- Friendly API error handling and retry actions
- Responsive UI for mobile and desktop

## Technology Stack

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- React Context API
- JSON Server
- Vitest
- React Testing Library

## Application Architecture

```text
React UI
   |
   v
React Router + Context API
   |
   v
Axios API service
   |
   v
JSON Server (mock API)
   |
   v
db.json
```

JSON Server is used as the mock backend required for the frontend project. During local development, it runs on port `4000`.

## Routes

| Route | Purpose |
|---|---|
| `/` | Home page |
| `/apply` | Multi-step application |
| `/confirmation` | Successful submission confirmation |
| `/dashboard` | Applicant status |
| `/admin` | Admin application list |
| `/admin/applications/:id` | Application review/details |

## Running Locally

Install dependencies:

```bash
npm install
```

Start the mock API:

```bash
npm run server
```

In a second terminal, start the frontend:

```bash
npm run dev
```

Open:

```text
http://localhost:5173
```

## Testing

The project contains unit and component tests using Vitest and React Testing Library.

Run the complete test suite:

```bash
npm run test
```

Current test result:

```text
6 test files passed
47 tests passed
```

## Production Build

Create the production build with:

```bash
npm run build
```

The production output is generated in the `dist/` directory.

## Screenshots

Project screenshots are available in the [`Screenshots`](./Screenshots) folder.

They cover:

- Home page
- Personal Information
- Academic Information
- Guardian Information
- Application confirmation
- Applicant status
- Admin dashboard
- Application details/review

## Presentation

The project presentation PDF is available here:

[ApplyNow Project Presentation](./ApplyNow-Presentation.pdf)

## Colour Palette

The interface uses a warm paper background, deep navy typography/navigation, gold primary actions, and green approval/status accents.

**Colour palette:** https://coolors.co/10243f-d9a21b-f7f1e5-2f7d68-e76f51

## Deployment Note

The Vercel deployment hosts the React frontend. JSON Server is the project's mock API and is intended for local development/testing rather than as a production backend service.

## Project Structure

```text
src/
├── components/
├── context/
├── forms/
├── pages/
├── services/
├── test/
└── utils/

Screenshots/
db.json
package.json
vite.config.js
tailwind.config.js
README.md
ApplyNow-Presentation.pdf
```

## Project Purpose

ApplyNow demonstrates practical frontend engineering skills including component-based React development, routing, state management, form validation, API integration, responsive styling, error handling, and automated testing.
