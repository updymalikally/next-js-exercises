type Product = { id: number; title: string };
type ProductsResponse = { products: Product[] };

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const response = await fetch("https://dummyjson.com/products?limit=5", { cache: "no-store" });
  if (!response.ok) throw new Error("Could not load products.");
  const { products } = (await response.json()) as ProductsResponse;

  return (
    <main>
      <h1>Five Products</h1>
      <ul>{products.slice(0, 5).map((product) => <li key={product.id}>{product.title}</li>)}</ul>
    </main>
  );
}
