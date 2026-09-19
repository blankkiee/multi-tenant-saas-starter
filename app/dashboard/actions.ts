"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { TaskStatus } from "@/app/generated/prisma/enums";

async function requireOrg() {
  const { orgId, userId } = await auth.protect();

  if (!orgId) {
    throw new Error("Select an organization first.");
  }

  return { orgId, userId };
}

export async function createTask(formData: FormData) {
  const { orgId, userId } = await requireOrg();

  const title = formData.get("title");
  if (typeof title !== "string" || title.trim() === "") {
    return;
  }

  await prisma.task.create({
    data: { title: title.trim(), orgId, createdBy: userId },
  });

  revalidatePath("/dashboard");
}

export async function moveTask(formData: FormData) {
  const { orgId } = await requireOrg();

  const id = String(formData.get("id"));
  const status = String(formData.get("status")) as TaskStatus;

  if (!Object.values(TaskStatus).includes(status)) {
    return;
  }

  // Scoping the update by orgId keeps one organization from touching another's tasks.
  await prisma.task.updateMany({
    where: { id, orgId },
    data: { status },
  });

  revalidatePath("/dashboard");
}

export async function deleteTask(formData: FormData) {
  const { orgId } = await requireOrg();

  await prisma.task.deleteMany({
    where: { id: String(formData.get("id")), orgId },
  });

  revalidatePath("/dashboard");
}
