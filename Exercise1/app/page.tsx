export default function HomePage() {
  return (
    <main>
      <h1>Next.js Routing Exercises</h1>
      <p>Try the routes implemented in this exercise:</p>
      <ul>
        <li><a href="/notifications">Grouped route: /notifications</a></li>
        <li><a href="/users/alex">Dynamic user route: /users/alex</a></li>
        <li><a href="/blog/nextjs/routing">Catch-all blog route: /blog/nextjs/routing</a></li>
        <li><a href="/api/users/alex">User API: /api/users/alex</a></li>
      </ul>
    </main>
  );
}
