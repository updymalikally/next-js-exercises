import { auth } from "../../../../auth";
import connectDB from "../../../../lib/db";
import Task from "../../../../models/Task";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

type RouteContext = { params: Promise<{ id: string }> };

async function getOwnedTaskId(context: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  const { id } = await context.params;
  if (!mongoose.Types.ObjectId.isValid(id)) return { error: NextResponse.json({ error: "Invalid task ID." }, { status: 400 }) };
  return { userId: session.user.id, id };
}

export async function GET(_request: Request, context: RouteContext) {
  const access = await getOwnedTaskId(context);
  if ("error" in access) return access.error;
  await connectDB();
  const task = await Task.findOne({ _id: access.id, userId: access.userId }).lean();
  if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });
  return NextResponse.json({ ...task, _id: task._id.toString(), userId: task.userId.toString() });
}

export async function PUT(request: Request, context: RouteContext) {
  const access = await getOwnedTaskId(context);
  if ("error" in access) return access.error;
  try {
    const body = await request.json();
    const update: Record<string, string> = {};
    if (body.title !== undefined) {
      const title = String(body.title).trim();
      if (!title || title.length > 160) return NextResponse.json({ error: "Title must contain 1–160 characters." }, { status: 400 });
      update.title = title;
    }
    if (body.description !== undefined) {
      const description = String(body.description).trim();
      if (description.length > 1200) return NextResponse.json({ error: "Description is too long." }, { status: 400 });
      update.description = description;
    }
    if (body.status !== undefined) {
      if (!["todo", "in-progress", "done"].includes(body.status)) return NextResponse.json({ error: "Invalid task status." }, { status: 400 });
      update.status = body.status;
    }
    if (Object.keys(update).length === 0) return NextResponse.json({ error: "No valid changes provided." }, { status: 400 });

    await connectDB();
    const task = await Task.findOneAndUpdate(
      { _id: access.id, userId: access.userId },
      { $set: update },
      { new: true, runValidators: true },
    ).lean();
    if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });
    return NextResponse.json({ ...task, _id: task._id.toString(), userId: task.userId.toString() });
  } catch (error) {
    console.error("Task update failed:", error);
    return NextResponse.json({ error: "Could not update the task." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  const access = await getOwnedTaskId(context);
  if ("error" in access) return access.error;
  await connectDB();
  const task = await Task.findOneAndDelete({ _id: access.id, userId: access.userId });
  if (!task) return NextResponse.json({ error: "Task not found." }, { status: 404 });
  return NextResponse.json({ message: "Task deleted." });
}
