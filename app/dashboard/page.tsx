import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { createNote } from "./actions";

export default async function DashboardPage() {
  const { orgId } = await auth.protect();

  const organization = orgId
    ? await (await clerkClient()).organizations.getOrganization({
        organizationId: orgId,
      })
    : null;

  const notes = orgId
    ? await prisma.note.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  return (
    <main className="flex flex-1 flex-col items-center gap-8 p-16">
      {organization ? (
        <h1 className="text-3xl font-semibold">
          Welcome to {organization.name}
        </h1>
      ) : (
        <div className="text-center">
          <h1 className="text-3xl font-semibold">
            You&apos;re signed in, but not part of an organization yet.
          </h1>
          <p className="text-zinc-600 dark:text-zinc-400">
            Use the organization switcher in the header above to create or
            join one.
          </p>
        </div>
      )}

      {orgId && (
        <div className="flex w-full max-w-md flex-col gap-4">
          <form action={createNote} className="flex gap-2">
            <input
              name="content"
              placeholder="Write a note for this organization..."
              className="flex-1 rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
              required
            />
            <button
              type="submit"
              className="rounded bg-foreground px-4 py-2 text-background"
            >
              Add
            </button>
          </form>

          <ul className="flex flex-col gap-2">
            {notes.length === 0 && (
              <li className="text-zinc-500">
                No notes yet for this organization.
              </li>
            )}
            {notes.map((note) => (
              <li
                key={note.id}
                className="rounded border border-zinc-200 px-3 py-2 dark:border-zinc-800"
              >
                {note.content}
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
