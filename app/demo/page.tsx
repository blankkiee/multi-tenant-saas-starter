import type { Metadata } from "next";
import Link from "next/link";
import { SignUpButton } from "@clerk/nextjs";
import { TaskBoard } from "../task-board";
import { DEMO_ORG_NAME, DEMO_PEOPLE, DEMO_TASKS } from "@/lib/demo";

export const metadata: Metadata = {
  title: "Demo — Lanes",
  description: "A read-only look at a Lanes board.",
};

export default function DemoPage() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-8 px-5 py-10 sm:px-8">
      <div className="flex flex-col gap-4 rounded-lg border border-border bg-background p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium">You&apos;re viewing a demo board</p>
          <p className="mt-0.5 text-sm text-muted">
            Sample data, read-only. Create a free account to get a board your
            team can actually edit.
          </p>
        </div>
        <SignUpButton>
          <button className="shrink-0 cursor-pointer rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90">
            Create your board
          </button>
        </SignUpButton>
      </div>

      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight">
          {DEMO_ORG_NAME}
        </h1>
        <p className="text-sm text-muted">
          {DEMO_TASKS.length} tasks, visible only to this organization.
        </p>
      </div>

      <TaskBoard tasks={DEMO_TASKS} creatorNames={DEMO_PEOPLE} readOnly />

      <p className="text-sm text-muted">
        Every organization sees only its own tasks.{" "}
        <Link href="/" className="underline underline-offset-4">
          Read how it works
        </Link>
        .
      </p>
    </main>
  );
}
