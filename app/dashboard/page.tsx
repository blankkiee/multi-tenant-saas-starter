import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { TaskBoard } from "../task-board";
import { createTask } from "./actions";

export default async function DashboardPage() {
  const { orgId } = await auth.protect();
  const client = await clerkClient();

  const organization = orgId
    ? await client.organizations.getOrganization({ organizationId: orgId })
    : null;

  if (!organization) {
    return (
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center gap-3 px-5 py-24 text-center sm:px-8">
        <h1 className="text-xl font-semibold">No organization selected</h1>
        <p className="max-w-sm text-sm text-muted">
          Use the organization switcher in the header to create one or join an
          existing team.
        </p>
      </main>
    );
  }

  const tasks = await prisma.task.findMany({
    where: { orgId: organization.id },
    orderBy: { createdAt: "desc" },
  });

  const creatorIds = [...new Set(tasks.map((task) => task.createdBy))];
  const creators = creatorIds.length
    ? (await client.users.getUserList({ userId: creatorIds })).data
    : [];
  const creatorNames = new Map(
    creators.map((user) => [
      user.id,
      user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "a teammate",
    ]),
  );

  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {organization.name}
        </h1>
        <p className="text-sm text-muted">
          {tasks.length === 0
            ? "No tasks yet — add the first one below."
            : `${tasks.length} ${tasks.length === 1 ? "task" : "tasks"}, visible only to this organization.`}
        </p>
      </div>

      <form action={createTask} className="flex gap-2">
        <input
          name="title"
          placeholder="What needs to be done?"
          required
          maxLength={200}
          className="flex-1 rounded-md border border-border bg-background px-3.5 py-2 text-sm outline-none transition-colors placeholder:text-muted focus:border-accent"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          Add task
        </button>
      </form>

      <TaskBoard tasks={tasks} creatorNames={creatorNames} />
    </main>
  );
}
