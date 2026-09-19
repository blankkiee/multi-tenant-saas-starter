# Lanes

A multi-tenant task board. Each organization gets its own private board — users
can belong to several organizations and switch between them, and tasks are
never visible across organization boundaries.

Built as a demonstration of the plumbing behind a typical B2B SaaS app:
authentication, organizations, and per-tenant data isolation.

## Stack

| Concern        | Choice                                        |
| -------------- | --------------------------------------------- |
| Framework      | Next.js (App Router, Server Actions)          |
| Database       | Neon (serverless Postgres)                    |
| ORM            | Prisma                                        |
| Auth & tenants | Clerk, using Organizations for multi-tenancy  |
| Styling        | Tailwind CSS                                  |
| Hosting        | Vercel                                        |

## How multi-tenancy works

Clerk is the source of truth for users and organizations, so the database
stores no user or organization tables of its own. Each row of application data
carries the Clerk organization ID it belongs to:

```prisma
model Task {
  id        String     @id @default(cuid())
  title     String
  status    TaskStatus @default(TODO)
  orgId     String
  createdBy String
  createdAt DateTime   @default(now())

  @@index([orgId])
}
```

Every read and write is scoped to the caller's active organization, which is
resolved server-side from the session rather than trusted from the client:

```ts
const { orgId } = await auth.protect();

await prisma.task.updateMany({
  where: { id, orgId }, // orgId in the filter is what enforces isolation
  data: { status },
});
```

Writes use `updateMany` / `deleteMany` with `orgId` in the `where` clause so a
task ID belonging to another organization matches zero rows instead of being
modified.

## Running locally

```bash
npm install
npx prisma migrate dev
npm run dev
```

Requires a `.env.local` with:

```
DATABASE_URL=                        # Neon connection string
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=   # Clerk publishable key
CLERK_SECRET_KEY=                    # Clerk secret key
```

Clerk's application must have **Organizations** enabled.

## Deploying

The same three environment variables need to be set in the hosting project.
`prisma generate` runs on `postinstall` so the client is available at build
time. Database migrations are applied separately with `npx prisma migrate deploy`.
