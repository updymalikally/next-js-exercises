import TodoDashboard from "./components/TodoDashboard";
import { listTodos } from "../lib/todos";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let todos;
  let connectionError: string | null = null;

  try {
    todos = await listTodos();
  } catch (error) {
    console.error("Could not connect to MongoDB:", error);
    todos = [];
    connectionError = "Could not connect to MongoDB. Copy .env.example to .env.local and set MONGODB_URI.";
  }

  return (
    <main>
      <h1>Todo Dashboard</h1>
      <p className="subtitle">Search, prioritize, and update todos together.</p>
      {connectionError && <p className="error" role="alert">{connectionError}</p>}
      <TodoDashboard initialTodos={todos} />
    </main>
  );
}
