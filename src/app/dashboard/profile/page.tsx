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
    <div className="p-4 lg:p-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Edit Profile</h1>
          <p className="text-muted-foreground mt-1">
            Update your personal information and organization details.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border bg-card p-6">
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
