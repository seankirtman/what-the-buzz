# What's The Buzz Gardens

get your flowers here

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file with `DATABASE_URL` and `ADMIN_PASSWORD` (see `.env.example` if available).

3. Set up the database:

```bash
npx prisma migrate dev
npx prisma db seed
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser.
