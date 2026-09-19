import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-6 p-16 text-center">
      <h1 className="max-w-lg text-4xl font-semibold tracking-tight">
        A task board for every team
      </h1>
      <p className="max-w-md text-lg text-zinc-600 dark:text-zinc-400">
        Create an organization, invite your team, and track work together. Each
        organization gets its own private board.
      </p>
      <Link
        href="/dashboard"
        className="rounded-full bg-foreground px-6 py-3 text-background transition-colors hover:bg-[#383838] dark:hover:bg-[#ccc]"
      >
        Open your board
      </Link>
    </main>
  );
}
