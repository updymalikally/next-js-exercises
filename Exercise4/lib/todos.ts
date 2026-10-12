import { ObjectId, type Collection } from "mongodb";
import { getDb } from "./mongodb";

export type Priority = "low" | "medium" | "high";
export type Todo = {
  id: string;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
};

export type TodoDocument = {
  _id: ObjectId;
  title: string;
  completed: boolean;
  priority: Priority;
  createdAt: Date;
  updatedAt: Date;
};

const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

async function collection(): Promise<Collection<TodoDocument>> {
  return (await getDb()).collection<TodoDocument>("todos");
}

function toTodo(document: TodoDocument): Todo {
  return {
    id: document._id.toString(),
    title: document.title,
    completed: document.completed,
    priority: document.priority,
    createdAt: document.createdAt.toISOString(),
    updatedAt: document.updatedAt.toISOString(),
  };
}

export async function listTodos(options: { query?: string; status?: string } = {}): Promise<Todo[]> {
  const todos = await collection();
  const filter: { title?: { $regex: string; $options: string }; completed?: boolean } = {};

  if (options.query?.trim()) {
    const escaped = options.query.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    filter.title = { $regex: escaped, $options: "i" };
  }
  if (options.status === "completed") filter.completed = true;
  if (options.status === "active") filter.completed = false;

  const documents = await todos.find(filter).sort({ createdAt: -1 }).toArray();
  return documents.map(toTodo).sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

export async function createTodo(title: string, priority: Priority): Promise<void> {
  const now = new Date();
  await (await collection()).insertOne({
    _id: new ObjectId(), title, priority, completed: false, createdAt: now, updatedAt: now,
  });
}

export async function updateTodoCompletion(ids: string[], completed: boolean): Promise<void> {
  const objectIds = ids.filter(ObjectId.isValid).map((id) => new ObjectId(id));
  if (objectIds.length === 0) return;
  await (await collection()).updateMany(
    { _id: { $in: objectIds } },
    { $set: { completed, updatedAt: new Date() } },
  );
}

export async function deleteTodos(ids: string[]): Promise<void> {
  const objectIds = ids.filter(ObjectId.isValid).map((id) => new ObjectId(id));
  if (objectIds.length === 0) return;
  await (await collection()).deleteMany({ _id: { $in: objectIds } });
}
