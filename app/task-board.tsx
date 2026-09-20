import { TaskStatus } from "@prisma/client";
import { deleteTask, moveTask } from "./dashboard/actions";

const COLUMNS = [
  { status: TaskStatus.TODO, label: "To do", dot: "bg-muted" },
  { status: TaskStatus.IN_PROGRESS, label: "In progress", dot: "bg-accent" },
  { status: TaskStatus.DONE, label: "Done", dot: "bg-emerald-500" },
];

export type BoardTask = {
  id: string;
  title: string;
  status: TaskStatus;
  createdBy: string;
};

export function TaskBoard({
  tasks,
  creatorNames,
  readOnly = false,
}: {
  tasks: BoardTask[];
  creatorNames: Map<string, string>;
  readOnly?: boolean;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {COLUMNS.map((column, columnIndex) => {
        const columnTasks = tasks.filter(
          (task) => task.status === column.status,
        );

        return (
          <section key={column.status} className="flex flex-col gap-3">
            <div className="flex items-center gap-2 px-1">
              <span className={`size-1.5 rounded-full ${column.dot}`} />
              <h2 className="text-xs font-medium uppercase tracking-wider">
                {column.label}
              </h2>
              <span className="ml-auto text-xs text-muted">
                {columnTasks.length}
              </span>
            </div>

            <div className="flex min-h-24 flex-col gap-2 rounded-lg border border-dashed border-border p-2">
              {columnTasks.length === 0 && (
                <p className="m-auto text-xs text-muted">Empty</p>
              )}

              {columnTasks.map((task) => (
                <article
                  key={task.id}
                  className="group rounded-md border border-border bg-background p-3 transition-shadow hover:shadow-sm"
                >
                  <p className="text-sm leading-snug">{task.title}</p>
                  <p className="mt-1 text-xs text-muted">
                    {creatorNames.get(task.createdBy) ?? "A teammate"}
                  </p>

                  {!readOnly && (
                    <div className="mt-2.5 flex items-center gap-1">
                      {columnIndex > 0 && (
                        <form action={moveTask}>
                          <input type="hidden" name="id" value={task.id} />
                          <input
                            type="hidden"
                            name="status"
                            value={COLUMNS[columnIndex - 1].status}
                          />
                          <button
                            title={`Move to ${COLUMNS[columnIndex - 1].label}`}
                            className="flex size-6 cursor-pointer items-center justify-center rounded text-muted transition-colors hover:bg-subtle hover:text-foreground"
                          >
                            &larr;
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
                            title={`Move to ${COLUMNS[columnIndex + 1].label}`}
                            className="flex size-6 cursor-pointer items-center justify-center rounded text-muted transition-colors hover:bg-subtle hover:text-foreground"
                          >
                            &rarr;
                          </button>
                        </form>
                      )}

                      <form action={deleteTask} className="ml-auto">
                        <input type="hidden" name="id" value={task.id} />
                        <button
                          title="Delete task"
                          className="flex size-6 cursor-pointer items-center justify-center rounded text-muted opacity-0 transition-all hover:bg-subtle hover:text-red-500 focus-visible:opacity-100 group-hover:opacity-100"
                        >
                          &times;
                        </button>
                      </form>
                    </div>
                  )}
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
