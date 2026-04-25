import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    redirect('/login');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user || !user.isOnboarded) {
    redirect('/onboarding');
  }

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar user={{
        name: user.name,
        email: user.email,
        organizationName: user.organizationName
      }} />
      <main className="flex-1 overflow-y-auto bg-background flex flex-col">
        <header className="h-14 border-b flex items-center justify-end px-6 sticky top-0 bg-background/80 backdrop-blur-md z-10 transition-none">
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold leading-none mb-1">{user.name}</p>
              <p className="text-[10px] text-muted-foreground leading-none">{user.email}</p>
            </div>
            <div className="size-8 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-xs border border-border/50">
              {user.name[0]}
            </div>
          </div>
        </header>
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  );
}
