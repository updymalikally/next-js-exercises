type UserPageProps = {
  params: Promise<{ username: string }>;
};

export default async function UserPage({ params }: UserPageProps) {
  const { username } = await params;
  return <main><h1>Welcome, {username}</h1></main>;
}
