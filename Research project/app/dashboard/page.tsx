import { redirect } from "next/navigation";
import { auth } from "../../auth";
import connectDB from "../../lib/db";
import Task from "../../models/Task";
import TaskBoard, { type BoardTask } from "../components/TaskBoard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  await connectDB();
  const docs = await Task.find({ userId: session.user.id }).sort({ updatedAt: -1 }).lean();
  const tasks: BoardTask[] = docs.map((task) => ({
    id: task._id.toString(),
    title: task.title,
    description: task.description,
    status: task.status as BoardTask["status"],
    updatedAt: task.updatedAt.toISOString(),
  }));

  return <TaskBoard userName={session.user.name || session.user.email || "there"} initialTasks={tasks} />;
}
