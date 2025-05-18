import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import './_styles/globals.css';
import { auth } from '@/auth';
import { AppSidebar } from '@/components/app-sidebar';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang='en'>
      <body className={`antialiased`}>
        <SidebarProvider>
          {session?.user && <AppSidebar user={session.user} />}
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </body>
    </html>
  );
}

// TODO ADD FAVICON TO APP FOLDER
// TODO ADD DATABASE AND DIRECT URL
// TODO PNPM DLX PRISMA GENERATE
// TODO PNPM DLX AUTH SECRET
