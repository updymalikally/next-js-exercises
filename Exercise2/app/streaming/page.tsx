import { Suspense } from "react";
import SlowComponent from "./SlowComponent";

export const dynamic = "force-dynamic";

export default function StreamingPage() {
  return (
    <main>
      <h1>Streaming Exercise</h1>
      <Suspense fallback={<p>Loading...</p>}>
        <SlowComponent />
      </Suspense>
    </main>
  );
}
