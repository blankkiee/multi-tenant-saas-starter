import { TaskStatus } from "@prisma/client";
import type { BoardTask } from "@/app/task-board";

// The demo board is fixed sample content rather than seeded rows: it renders
// instantly even when the database has gone to sleep, and visitors cannot
// leave it in a broken state.
export const DEMO_ORG_NAME = "Northwind Studio";

export const DEMO_PEOPLE = new Map([
  ["maya", "Maya"],
  ["daniel", "Daniel"],
  ["priya", "Priya"],
  ["tom", "Tom"],
]);

export const DEMO_TASKS: BoardTask[] = [
  {
    id: "demo-1",
    title: "Write onboarding emails for new workspaces",
    status: TaskStatus.TODO,
    createdBy: "maya",
  },
  {
    id: "demo-2",
    title: "Audit colour contrast on the settings page",
    status: TaskStatus.TODO,
    createdBy: "priya",
  },
  {
    id: "demo-3",
    title: "Draft the Q4 roadmap",
    status: TaskStatus.TODO,
    createdBy: "daniel",
  },
  {
    id: "demo-4",
    title: "Migrate billing to the new pricing tiers",
    status: TaskStatus.IN_PROGRESS,
    createdBy: "daniel",
  },
  {
    id: "demo-5",
    title: "Rebuild the reporting dashboard",
    status: TaskStatus.IN_PROGRESS,
    createdBy: "maya",
  },
  {
    id: "demo-6",
    title: "Ship dark mode",
    status: TaskStatus.DONE,
    createdBy: "priya",
  },
  {
    id: "demo-7",
    title: "Set up the staging environment",
    status: TaskStatus.DONE,
    createdBy: "tom",
  },
  {
    id: "demo-8",
    title: "Fix session timeout on mobile",
    status: TaskStatus.DONE,
    createdBy: "daniel",
  },
];
