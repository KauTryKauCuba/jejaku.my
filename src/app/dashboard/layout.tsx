import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { db } from '@/db';
import { users, organizations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { DashboardShell } from '@/components/layout/DashboardShell';

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

  const organization = user?.organizationId 
    ? await db.query.organizations.findFirst({
        where: eq(organizations.id, user.organizationId)
      })
    : null;

  if (!user || !user.isOnboarded) {
    redirect('/onboarding');
  }

  return (
    <DashboardShell user={{
      id: user.id,
      name: user.name,
      email: user.email,
      organizationName: organization?.name
    }}>
      {children}
    </DashboardShell>
  );
}
