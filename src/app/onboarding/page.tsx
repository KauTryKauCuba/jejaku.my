import React from 'react'
import { Logo } from '@/components/ui/SiteLogo'
import { AuthCard } from '@/components/ui/AuthCard'
import { OnboardingForm } from '@/components/auth/OnboardingForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Welcome to Jejaku',
  description: 'Tell us a bit about your organization to get started.',
}

export default function OnboardingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <div className="mb-8">
        <Logo className="h-5" />
      </div>

      <AuthCard 
        title="Welcome to Jejaku" 
        description="Let's set up your workspace in just a few seconds."
      >
        <div className="py-2">
          <OnboardingForm />
        </div>
        
        <p className="mt-8 text-center text-[10px] text-muted-foreground uppercase tracking-widest font-medium">
          Step 1 of 1 • Workspace Setup
        </p>
      </AuthCard>
    </div>
  )
}
