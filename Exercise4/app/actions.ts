"use server";

import { revalidatePath } from "next/cache";
import { createTodo, deleteTodos, listTodos, updateTodoCompletion, type Priority, type Todo } from "../lib/todos";

export type CreateTodoState = { error?: string; success?: string } | null;
export type SearchTodoState = { todos: Todo[]; error?: string };

const priorities: Priority[] = ["low", "medium", "high"];

export async function createTodoAction(_previous: CreateTodoState, formData: FormData): Promise<CreateTodoState> {
  const title = String(formData.get("title") ?? "").trim();
  const rawPriority = String(formData.get("priority") ?? "medium");

  if (!title) return { error: "Enter a todo title." };
  if (!priorities.includes(rawPriority as Priority)) return { error: "Choose a valid priority." };

  await createTodo(title, rawPriority as Priority);
  revalidatePath("/");
  return { success: "Todo added." };
}

export async function searchTodosAction(_previous: SearchTodoState, formData: FormData): Promise<SearchTodoState> {
  const query = String(formData.get("query") ?? "");
  const status = String(formData.get("status") ?? "all");
  try {
    return { todos: await listTodos({ query, status }) };
  } catch (error) {
    console.error("Could not search todos:", error);
    return { todos: [], error: "Could not load todos. Check your MongoDB connection." };
  }
}

export async function bulkDeleteTodosAction(ids: string[]): Promise<void> {
  await deleteTodos(ids);
  revalidatePath("/");
}

export async function bulkSetCompletionAction(ids: string[], completed: boolean): Promise<void> {
  await updateTodoCompletion(ids, completed);
  revalidatePath("/");
}
