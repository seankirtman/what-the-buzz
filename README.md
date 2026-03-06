# What's The Buzz Gardens

get your flowers here

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env` and set `DATABASE_URL` (PostgreSQL) and `ADMIN_PASSWORD`.

3. Set up the database (use [Neon](https://neon.tech) or [Vercel Postgres](https://vercel.com/storage/postgres) for a free PostgreSQL database):

```bash
npx prisma migrate dev
npx prisma db seed
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.

## Deploy to Vercel

1. Create a PostgreSQL database ([Neon](https://neon.tech) or [Vercel Postgres](https://vercel.com/storage/postgres)). Use the connection string (not the pooled one for Neon—or use pooled if you prefer).
2. In your Vercel project, add environment variables: `DATABASE_URL` (PostgreSQL URL), `ADMIN_PASSWORD`, and optionally `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `DORRIE_EMAIL` for contact form emails.
3. Deploy. The build runs `prisma migrate deploy` to apply migrations.
4. Update your local `.env` to use the PostgreSQL `DATABASE_URL` (replace the old SQLite `file:./prisma/dev.db`).
5. After first deploy, run `npx prisma db seed` locally (with your prod `DATABASE_URL`) to seed sample dahlias, or add dahlias via the admin panel.
