import React from 'react';
import { redirect } from 'next/navigation';
import { getSession } from '@/lib/session';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { EditProfileForm } from '@/components/auth/EditProfileForm';
import { UserCircle } from 'lucide-react';

export default async function ProfilePage() {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    redirect('/login');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
          <UserCircle className="size-8 text-primary" />
          Edit Profile
        </h1>
        <p className="text-muted-foreground mt-1">
          Update your personal information and organization details.
        </p>
      </div>

      <div className="rounded-2xl border bg-card/50 backdrop-blur-sm p-6 lg:p-8">
        <EditProfileForm user={{
          name: user.name,
          email: user.email,
          organizationName: user.organizationName,
          role: user.role,
          industry: user.industry
        }} />
      </div>
    </div>
  );
}
