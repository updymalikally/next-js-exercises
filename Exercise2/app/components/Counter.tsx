"use client";

import { useState } from "react";

export default function Counter() {
  const [count, setCount] = useState(0);
  return (
    <section>
      <p>Count: {count}</p>
      <button onClick={() => setCount((current) => current + 1)}>Increment</button>
    </section>
  );
}
