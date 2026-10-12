import { auth } from "../../../auth";
import connectDB from "../../../lib/db";
import Task from "../../../models/Task";
import type { TaskRecord } from "../../../models/Task";
import type { FilterQuery } from "mongoose";
import mongoose from "mongoose";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const query = searchParams.get("q")?.trim();
  const filter: FilterQuery<TaskRecord> = { userId: new mongoose.Types.ObjectId(session.user.id) };
  if (status === "todo" || status === "in-progress" || status === "done") filter.status = status;
  if (query) filter.title = { $regex: query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), $options: "i" };

  await connectDB();
  const tasks = await Task.find(filter).sort({ updatedAt: -1 }).lean();
  return NextResponse.json(tasks.map((task) => ({ ...task, _id: task._id.toString(), userId: task.userId.toString() })));
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body = await request.json();
    const title = String(body.title ?? "").trim();
    const description = String(body.description ?? "").trim();
    if (!title || title.length > 160 || description.length > 1200) {
      return NextResponse.json({ error: "A title is required (maximum 160 characters); description must be 1,200 characters or fewer." }, { status: 400 });
    }
    await connectDB();
    const task = await Task.create({ title, description, userId: session.user.id });
    return NextResponse.json({ ...task.toObject(), _id: task._id.toString(), userId: task.userId.toString() }, { status: 201 });
  } catch (error) {
    console.error("Task creation failed:", error);
    return NextResponse.json({ error: "Could not create the task." }, { status: 500 });
  }
}
