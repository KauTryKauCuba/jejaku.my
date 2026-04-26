import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { getSession } from '@/lib/session';

export default async function DashboardPage() {
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
    <div className="p-5">
      <h1 className="text-xl font-bold mb-3">Welcome back, {user.name}!</h1>
      <div className="bg-muted/30 p-4 rounded-xl border border-border/50 mb-6">
        <h2 className="text-base font-semibold mb-1">Company: {user.organizationName}</h2>
        <p className="text-muted-foreground text-xs font-medium">Role: {user.role} • Industry: {user.industry}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-xl border bg-card/50">
          <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase tracking-wider">Active Projects</p>
          <p className="text-2xl font-bold">0</p>
        </div>
        <div className="p-4 rounded-xl border bg-card/50">
          <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase tracking-wider">Team Members</p>
          <p className="text-2xl font-bold">1</p>
        </div>
        <div className="p-4 rounded-xl border bg-card/50">
          <p className="text-xs font-semibold text-muted-foreground mb-0.5 uppercase tracking-wider">Tasks Pending</p>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>
    </div>
  );
}
