"use client";

import { useEffect, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { useRouter } from "next/navigation";
import {
  bulkDeleteTodosAction,
  bulkSetCompletionAction,
  createTodoAction,
  searchTodosAction,
  type SearchTodoState,
} from "../actions";
import type { Todo } from "../../lib/todos";

function relativeTime(isoDate: string, now: number): string {
  if (!now) return "just now";
  const elapsedSeconds = Math.max(0, Math.floor((now - new Date(isoDate).getTime()) / 1000));
  if (elapsedSeconds < 60) return "just now";
  if (elapsedSeconds < 3600) return `created ${Math.floor(elapsedSeconds / 60)} minute${Math.floor(elapsedSeconds / 60) === 1 ? "" : "s"} ago`;
  if (elapsedSeconds < 86400) return `created ${Math.floor(elapsedSeconds / 3600)} hour${Math.floor(elapsedSeconds / 3600) === 1 ? "" : "s"} ago`;
  return `created ${Math.floor(elapsedSeconds / 86400)} day${Math.floor(elapsedSeconds / 86400) === 1 ? "" : "s"} ago`;
}

export default function TodoDashboard({ initialTodos }: { initialTodos: Todo[] }) {
  const router = useRouter();
  const [createState, createAction] = useFormState(createTodoAction, null);
  const initialSearchState: SearchTodoState = { todos: initialTodos };
  const [searchState, searchAction] = useFormState(searchTodosAction, initialSearchState);
  const [visibleTodos, setVisibleTodos] = useState(initialTodos);
  const [selected, setSelected] = useState<string[]>([]);
  const [now, setNow] = useState(0);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setVisibleTodos(searchState.todos);
  }, [searchState.todos]);

  useEffect(() => {
    setVisibleTodos(initialTodos);
  }, [initialTodos]);

  useEffect(() => {
    const update = () => setNow(Date.now());
    update();
    const timer = window.setInterval(update, 60_000);
    return () => window.clearInterval(timer);
  }, []);

  function runBulkAction(action: (ids: string[]) => Promise<void>) {
    const ids = [...selected];
    startTransition(async () => {
      await action(ids);
      setSelected([]);
      router.refresh();
    });
  }

  function toggleSelected(id: string) {
    setSelected((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <div className="dashboard">
      <section className="panel">
        <h2>Add a todo</h2>
        <form action={createAction} className="create-form">
          <label className="sr-only" htmlFor="todo-title">Todo title</label>
          <input id="todo-title" name="title" placeholder="What needs to be done?" required maxLength={180} />
          <label className="sr-only" htmlFor="todo-priority">Priority</label>
          <select id="todo-priority" name="priority" defaultValue="medium">
            <option value="low">Low priority</option>
            <option value="medium">Medium priority</option>
            <option value="high">High priority</option>
          </select>
          <button type="submit">Add todo</button>
        </form>
        {createState?.error && <p className="error" role="alert">{createState.error}</p>}
        {createState?.success && <p className="success" role="status">{createState.success}</p>}
      </section>

      <section className="panel">
        <h2>Find todos</h2>
        <form action={searchAction} className="search-form">
          <label className="sr-only" htmlFor="todo-search">Search todos</label>
          <input id="todo-search" name="query" type="search" placeholder="Search titles" />
          <label className="sr-only" htmlFor="todo-status">Completion status</label>
          <select id="todo-status" name="status" defaultValue="all">
            <option value="all">All todos</option>
            <option value="active">Incomplete</option>
            <option value="completed">Completed</option>
          </select>
          <button type="submit">Search</button>
        </form>
        {searchState.error && <p className="error" role="alert">{searchState.error}</p>}
      </section>

      <section className="panel">
        <div className="list-heading">
          <h2>Todos</h2>
          <span>{visibleTodos.length} shown · sorted by priority</span>
        </div>
        {selected.length > 0 && (
          <div className="bulk-actions">
            <span>{selected.length} selected</span>
            <button disabled={isPending} onClick={() => runBulkAction((ids) => bulkSetCompletionAction(ids, true))}>Mark complete</button>
            <button disabled={isPending} onClick={() => runBulkAction((ids) => bulkSetCompletionAction(ids, false))}>Mark incomplete</button>
            <button className="danger" disabled={isPending} onClick={() => runBulkAction(bulkDeleteTodosAction)}>Delete selected</button>
          </div>
        )}
        {visibleTodos.length === 0 ? <p className="empty">No todos found.</p> : (
          <ul className="todo-list">
            {visibleTodos.map((todo) => (
              <li key={todo.id} className={todo.completed ? "todo completed" : "todo"}>
                <input
                  type="checkbox"
                  aria-label={`Select ${todo.title}`}
                  checked={selected.includes(todo.id)}
                  onChange={() => toggleSelected(todo.id)}
                />
                <div className="todo-copy">
                  <strong>{todo.title}</strong>
                  <span>{relativeTime(todo.createdAt, now)}</span>
                  {todo.updatedAt !== todo.createdAt && <span>Updated {relativeTime(todo.updatedAt, now).replace("created ", "")}</span>}
                </div>
                <span className={`priority ${todo.priority}`}>{todo.priority}</span>
                <span className="status">{todo.completed ? "Complete" : "Active"}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
