type BlogPageProps = {
  params: Promise<{ slug: string[] }>;
};

export default async function BlogPage({ params }: BlogPageProps) {
  const { slug } = await params;
  return <main><h1>Blog route</h1><p>You visited: /{slug.join("/")}</p></main>;
}
