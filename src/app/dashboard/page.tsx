import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { Button } from '@/components/ui/Button';
import { getSession } from '@/lib/session';
import { logoutUser } from '@/app/actions/auth';
import Link from 'next/link';

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
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Welcome back, {user.name}!</h1>
      <div className="bg-muted p-6 rounded-xl border">
        <h2 className="text-lg font-semibold mb-2">Workspace: {user.organizationName}</h2>
        <p className="text-muted-foreground text-sm">Role: {user.role} • Industry: {user.industry}</p>
      </div>
      
      <div className="mt-8 flex gap-4">
        <Button asChild variant="outline">
          <Link href="/">Back to Landing Page</Link>
        </Button>
        <form action={async () => {
          'use server'
          await logoutUser()
        }}>
          <Button variant="destructive" type="submit">
            Logout
          </Button>
        </form>
      </div>
    </div>
  );
}
