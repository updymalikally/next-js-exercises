export const dynamic = "force-dynamic";

export default function TimePage() {
  return <main><h1>Current server time</h1><p>{new Date().toLocaleTimeString()}</p><p>Refresh this page to request a newly rendered time.</p></main>;
}
