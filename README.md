# Zealthy Mini EMR & Patient Portal

## Overview
This project is a full-stack application built as part of the Zealthy engineering exercise.

It includes:
- **Mini EMR (Admin)** → Manage patients, appointments, prescriptions
- **Patient Portal** → Patients view upcoming appointments and medication refills

---

## Tech Stack
- Next.js (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL

---

## Features

### Admin (/admin)
- View all patients
- Create new patients
- Edit patient info
- Manage appointments (CRUD)
- Manage prescriptions (CRUD)

### Patient Portal (/)
- Login with email/password
- Dashboard summary (next 7 days)
- View appointments (3 months)
- View prescriptions (3 months)

---

## Project Structure

src/app/
  page.tsx                # Login
  portal/                 # Patient Portal
  admin/                  # EMR

src/lib/
  db.ts                   # Prisma client
  auth.ts                 # Session handling
  portal.ts               # Recurrence logic

prisma/
  schema.prisma
  seed.ts

---

## Setup Instructions

### 1. Install dependencies
pnpm install

### 2. Setup environment variables
Create a `.env` file:

DATABASE_URL="postgresql://..."

### 3. Run database
pnpm prisma migrate dev
pnpm prisma db seed

### 4. Start dev server
pnpm dev

---

## Deployment (Vercel)

1. Push repo to GitHub
2. Import into Vercel
3. Add environment variable:
DATABASE_URL=your_production_db

4. Run:
pnpm prisma migrate deploy
pnpm prisma db seed

---

## Notes
- Authentication is intentionally simple (no auth for admin)
- Passwords are hashed using bcrypt
- Recurring schedules support:
  - none
  - weekly
  - monthly

---

## Submission
Provide:
- GitHub repo URL : https://github.com/JoeHancock1995/Zealthy
- Live deployed URL (Vercel): https://zealthy-pi.vercel.app/

---

## Author
Joe Hancock
