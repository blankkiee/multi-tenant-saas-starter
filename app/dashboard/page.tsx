import { auth, clerkClient } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/app/generated/prisma/enums";
import { createTask, deleteTask, moveTask } from "./actions";

const COLUMNS = [
  { status: TaskStatus.TODO, label: "To do" },
  { status: TaskStatus.IN_PROGRESS, label: "In progress" },
  { status: TaskStatus.DONE, label: "Done" },
];

export default async function DashboardPage() {
  const { orgId } = await auth.protect();
  const client = await clerkClient();

  const organization = orgId
    ? await client.organizations.getOrganization({ organizationId: orgId })
    : null;

  const tasks = orgId
    ? await prisma.task.findMany({
        where: { orgId },
        orderBy: { createdAt: "desc" },
      })
    : [];

  const creatorIds = [...new Set(tasks.map((task) => task.createdBy))];
  const creators = creatorIds.length
    ? (await client.users.getUserList({ userId: creatorIds })).data
    : [];
  const creatorNames = new Map(
    creators.map((user) => [
      user.id,
      user.firstName ?? user.emailAddresses[0]?.emailAddress ?? "Someone",
    ]),
  );

  if (!organization) {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-2 p-16 text-center">
        <h1 className="text-2xl font-semibold">No organization selected</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Use the organization switcher above to create or join one.
        </p>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-8 p-8 sm:p-12">
      <div>
        <h1 className="text-2xl font-semibold">{organization.name}</h1>
        <p className="text-zinc-600 dark:text-zinc-400">
          Tasks are visible only to members of this organization.
        </p>
      </div>

      <form action={createTask} className="flex gap-2">
        <input
          name="title"
          placeholder="What needs to be done?"
          required
          maxLength={200}
          className="flex-1 rounded border border-zinc-300 bg-transparent px-3 py-2 dark:border-zinc-700"
        />
        <button
          type="submit"
          className="rounded bg-foreground px-4 py-2 font-medium text-background"
        >
          Add task
        </button>
      </form>

      <div className="grid gap-4 sm:grid-cols-3">
        {COLUMNS.map((column, columnIndex) => {
          const columnTasks = tasks.filter(
            (task) => task.status === column.status,
          );

          return (
            <section
              key={column.status}
              className="flex flex-col gap-3 rounded-lg border border-zinc-200 p-4 dark:border-zinc-800"
            >
              <h2 className="flex justify-between text-sm font-medium uppercase tracking-wide text-zinc-500">
                {column.label}
                <span>{columnTasks.length}</span>
              </h2>

              {columnTasks.length === 0 && (
                <p className="text-sm text-zinc-400">Nothing here.</p>
              )}

              {columnTasks.map((task) => (
                <article
                  key={task.id}
                  className="flex flex-col gap-2 rounded border border-zinc-200 p-3 dark:border-zinc-800"
                >
                  <p className="font-medium">{task.title}</p>
                  <p className="text-xs text-zinc-500">
                    Added by {creatorNames.get(task.createdBy) ?? "Someone"}
                  </p>

                  <div className="flex gap-1">
                    {columnIndex > 0 && (
                      <form action={moveTask}>
                        <input type="hidden" name="id" value={task.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={COLUMNS[columnIndex - 1].status}
                        />
                        <button
                          className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700"
                          title={`Move to ${COLUMNS[columnIndex - 1].label}`}
                        >
                          ←
                        </button>
                      </form>
                    )}

                    {columnIndex < COLUMNS.length - 1 && (
                      <form action={moveTask}>
                        <input type="hidden" name="id" value={task.id} />
                        <input
                          type="hidden"
                          name="status"
                          value={COLUMNS[columnIndex + 1].status}
                        />
                        <button
                          className="rounded border border-zinc-300 px-2 py-1 text-xs dark:border-zinc-700"
                          title={`Move to ${COLUMNS[columnIndex + 1].label}`}
                        >
                          →
                        </button>
                      </form>
                    )}

                    <form action={deleteTask} className="ml-auto">
                      <input type="hidden" name="id" value={task.id} />
                      <button className="rounded border border-zinc-300 px-2 py-1 text-xs text-red-600 dark:border-zinc-700">
                        Delete
                      </button>
                    </form>
                  </div>
                </article>
              ))}
            </section>
          );
        })}
      </div>
    </main>
  );
}
