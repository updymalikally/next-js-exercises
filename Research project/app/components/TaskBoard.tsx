"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import SignOutButton from "./SignOutButton";

export type BoardTask = {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "done";
  updatedAt: string;
};

const columns: { id: BoardTask["status"]; title: string; accent: string }[] = [
  { id: "todo", title: "To do", accent: "bg-white/25" },
  { id: "in-progress", title: "In progress", accent: "bg-amber-300" },
  { id: "done", title: "Done", accent: "bg-lime-300" },
];

async function readResponse(response: Response) {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Something went wrong.");
  return data;
}

export default function TaskBoard({ userName, initialTasks }: { userName: string; initialTasks: BoardTask[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<BoardTask | null>(null);

  const filteredTasks = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return tasks;
    return tasks.filter((task) => `${task.title} ${task.description}`.toLowerCase().includes(normalized));
  }, [query, tasks]);

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    try {
      const task = await readResponse(await fetch("/api/tasks", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.get("title"), description: data.get("description") }),
      }));
      setTasks((current) => [toBoardTask(task), ...current]);
      form.reset();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not create the task.");
    } finally { setPending(false); }
  }

  async function saveTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!editing) return;
    setError("");
    const data = new FormData(event.currentTarget);
    try {
      const updated = await readResponse(await fetch(`/api/tasks/${editing.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: data.get("title"), description: data.get("description") }),
      }));
      setTasks((current) => current.map((task) => task.id === editing.id ? toBoardTask(updated) : task));
      setEditing(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not update the task.");
    }
  }

  async function moveTask(id: string, status: BoardTask["status"]) {
    const task = tasks.find((item) => item.id === id);
    if (!task || task.status === status) return;
    setError("");
    try {
      const updated = await readResponse(await fetch(`/api/tasks/${id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }),
      }));
      setTasks((current) => current.map((item) => item.id === id ? toBoardTask(updated) : item));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not move the task.");
    }
  }

  async function deleteTask(id: string) {
    setError("");
    try {
      await readResponse(await fetch(`/api/tasks/${id}`, { method: "DELETE" }));
      setTasks((current) => current.filter((task) => task.id !== id));
      if (editing?.id === id) setEditing(null);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Could not delete the task.");
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 sm:px-8">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-6">
        <Link href="/" className="text-lg font-bold">task<span className="text-lime-300">flow</span></Link>
        <div className="flex items-center gap-4"><span className="text-sm text-white/55">{userName}</span><SignOutButton /></div>
      </header>

      <section className="py-10">
        <p className="text-sm font-semibold uppercase tracking-[.22em] text-lime-300">Your workspace</p>
        <div className="mt-3 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div><h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">Task board</h1><p className="mt-2 text-white/55">Drag a card to move work forward.</p></div>
          <input aria-label="Search tasks" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search tasks…" className="w-full rounded-full border border-white/15 bg-white/[.04] px-4 py-2.5 outline-none focus:border-lime-300 sm:max-w-xs" />
        </div>
      </section>

      <section className="rounded-3xl border border-white/10 bg-white/[.035] p-5 sm:p-7">
        <h2 className="text-xl font-semibold">Capture a task</h2>
        <form onSubmit={createTask} className="mt-4 grid gap-3 md:grid-cols-[1fr_1.2fr_auto]">
          <input name="title" maxLength={160} required placeholder="Task title" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-lime-300" />
          <input name="description" maxLength={1200} placeholder="Add a short description (optional)" className="rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-lime-300" />
          <button disabled={pending} className="rounded-xl bg-lime-300 px-5 py-3 font-semibold text-zinc-950 disabled:opacity-60">{pending ? "Adding…" : "Add task +"}</button>
        </form>
      </section>

      {error && <p role="alert" className="mt-4 rounded-xl border border-rose-300/20 bg-rose-300/10 px-4 py-3 text-sm text-rose-200">{error}</p>}

      <section className="mt-6 grid items-start gap-4 lg:grid-cols-3">
        {columns.map((column) => {
          const columnTasks = filteredTasks.filter((task) => task.status === column.id);
          return (
            <div key={column.id} onDragOver={(event) => event.preventDefault()} onDrop={(event) => {
              event.preventDefault();
              if (draggedId) void moveTask(draggedId, column.id);
              setDraggedId(null);
            }} className="min-h-64 rounded-3xl border border-white/10 bg-white/[.025] p-4">
              <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold"><span className={`h-2 w-2 rounded-full ${column.accent}`} />{column.title}</h2><span className="text-sm text-white/45">{columnTasks.length}</span></div>
              <div className="space-y-3">
                {columnTasks.map((task) => (
                  <article key={task.id} draggable onDragStart={() => setDraggedId(task.id)} onDragEnd={() => setDraggedId(null)} className="cursor-grab rounded-2xl border border-white/10 bg-[#151c19] p-4 active:cursor-grabbing">
                    <div className="flex items-start justify-between gap-3"><h3 className="font-medium leading-6">{task.title}</h3><span className="text-xs text-white/35">⠿</span></div>
                    {task.description && <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-white/55">{task.description}</p>}
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-xs text-white/40"><span>Updated {new Date(task.updatedAt).toISOString().slice(0, 10)}</span><span className="flex gap-3"><button onClick={() => setEditing(task)} className="hover:text-lime-300">Edit</button><button onClick={() => void deleteTask(task.id)} className="hover:text-rose-300">Delete</button></span></div>
                  </article>
                ))}
                {columnTasks.length === 0 && <p className="rounded-2xl border border-dashed border-white/10 p-5 text-center text-sm text-white/35">Drop a task here</p>}
              </div>
            </div>
          );
        })}
      </section>

      {editing && <div className="fixed inset-0 z-10 grid place-items-center bg-black/70 p-5" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setEditing(null); }}>
        <form onSubmit={saveTask} className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#151c19] p-6 shadow-2xl">
          <div className="flex items-center justify-between"><h2 className="text-xl font-semibold">Edit task</h2><button type="button" aria-label="Close" onClick={() => setEditing(null)} className="text-white/50 hover:text-white">✕</button></div>
          <label className="mt-5 block text-sm">Title<input name="title" defaultValue={editing.title} maxLength={160} required className="mt-2 w-full rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-lime-300" /></label>
          <label className="mt-4 block text-sm">Description<textarea name="description" defaultValue={editing.description} maxLength={1200} rows={4} className="mt-2 w-full resize-y rounded-xl border border-white/10 bg-black/20 px-4 py-3 outline-none focus:border-lime-300" /></label>
          <div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setEditing(null)} className="rounded-xl border border-white/15 px-4 py-2">Cancel</button><button className="rounded-xl bg-lime-300 px-5 py-2 font-semibold text-zinc-950">Save changes</button></div>
        </form>
      </div>}
    </main>
  );
}

function toBoardTask(task: { _id: string; title: string; description: string; status: BoardTask["status"]; updatedAt: string | Date }): BoardTask {
  return { id: task._id, title: task.title, description: task.description ?? "", status: task.status, updatedAt: new Date(task.updatedAt).toISOString() };
}
