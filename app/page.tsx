import Link from "next/link";

const FEATURES = [
  {
    title: "Organizations",
    body: "Create a workspace for each team, or belong to several at once.",
  },
  {
    title: "Private by default",
    body: "Every task is scoped to one organization. Nothing leaks between teams.",
  },
  {
    title: "Invite your team",
    body: "Members share the same board and see each other's work instantly.",
  },
];

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center gap-16 px-5 py-20 sm:px-8 sm:py-28">
      <div className="flex flex-col items-center gap-6 text-center">
        <span className="rounded-full border border-border px-3 py-1 text-xs text-muted">
          Multi-tenant by design
        </span>

        <h1 className="max-w-2xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
          A shared task board for every team
        </h1>

        <p className="max-w-lg text-balance text-lg text-muted">
          Create an organization, invite your teammates, and track work
          together. Every organization gets its own private board.
        </p>

        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/dashboard"
            className="rounded-md bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-opacity hover:opacity-90"
          >
            Open your board
          </Link>
          <Link
            href="/demo"
            className="rounded-md border border-border px-5 py-2.5 text-sm font-medium transition-colors hover:bg-subtle"
          >
            View a demo board
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {FEATURES.map((feature) => (
          <div
            key={feature.title}
            className="rounded-lg border border-border bg-background p-5"
          >
            <h2 className="text-sm font-medium">{feature.title}</h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              {feature.body}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
