'use server';

export default async function Home({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className='flex h-full flex-col items-center justify-center'></main>
  );
}
