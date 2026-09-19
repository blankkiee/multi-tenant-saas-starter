"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export async function createNote(formData: FormData) {
  const { orgId } = await auth.protect();

  if (!orgId) {
    throw new Error("You must select an organization before adding notes.");
  }

  const content = formData.get("content");
  if (typeof content !== "string" || content.trim() === "") {
    return;
  }

  await prisma.note.create({
    data: {
      content: content.trim(),
      orgId,
    },
  });

  revalidatePath("/dashboard");
}
