export default async function SlowComponent() {
  await new Promise((resolve) => setTimeout(resolve, 3000));
  return <p>The slow content has loaded after three seconds.</p>;
}
