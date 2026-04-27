import React from 'react'
import { Logo } from '@/components/ui/SiteLogo'
import { AuthCard } from '@/components/ui/AuthCard'
import { OnboardingForm } from '@/components/auth/OnboardingForm'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome to Jejaku',
  description: 'Tell us a bit about your company to get started.',
}

export default async function OnboardingPage() {
  const session = await getSession();
  if (!session) redirect('/login');

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.userId),
  });

  if (!user) redirect('/login');
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-dot-grid [mask-image:radial-gradient(ellipse_at_center,white,transparent)] pointer-events-none" />
      <div className="relative mb-8">
        <Logo className="h-5" />
      </div>

      <AuthCard 
        title="Welcome to Jejaku" 
        description="Let's set up your workspace in just a few seconds."
      >
        <div className="py-2">
          <OnboardingForm user={{ name: user.name, email: user.email }} />
        </div>
        
      </AuthCard>
    </div>
  )
}
