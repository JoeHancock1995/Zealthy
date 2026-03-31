# Zealthy Full Stack Exercise Scaffold

A Next.js + Prisma starter for the Zealthy mini-EMR and Patient Portal exercise.

## Included

- `/` patient login
- `/portal` patient dashboard
- `/portal/appointments` upcoming appointments for 3 months
- `/portal/prescriptions` upcoming prescription refills for 3 months
- `/admin` patient list
- `/admin/patients/new` create patient
- `/admin/patients/[id]` patient detail with appointment and prescription management
- `/admin/patients/[id]/edit` edit patient
- Prisma schema + seed using the provided gist data

## Setup

```bash
pnpm install
cp .env.example .env
pnpm prisma migrate dev --name init
pnpm prisma db seed
pnpm dev
```

## Demo logins after seeding

- `mark@some-email-provider.net` / `Password123!`
- `lisa@some-email-provider.net` / `Password123!`

## Notes

- `/admin` intentionally has no auth because the exercise requires that.
- Passwords are hashed before being stored.
- Appointments and refills are generated from the first scheduled date plus a repeat schedule.
- The patient portal shows the next 7 days on the dashboard and the next 3 months on drill-down pages.
