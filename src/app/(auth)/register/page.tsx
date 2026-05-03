import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/SiteLogo'
import { AuthCard } from '@/components/ui/AuthCard'
import { ArrowLeft } from 'lucide-react'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { Tabs } from '@/components/ui/Tabs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create a new account to get started with Jejaku.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      {/* Back to Home */}
      <Link 
        href="/" 
        className="absolute top-8 left-8 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground group"
      >
        <ArrowLeft className="size-4" />
        Back to home
      </Link>

      <div className="mb-4">
        <Link href="/">
          <Logo />
        </Link>
      </div>

      <AuthCard 
        title="Create Account" 
        description="Join thousands of teams building better customer engagement"
      >
        <Tabs 
          tabs={[
            { id: 'login', label: 'Login', href: '/login', active: false },
            { id: 'register', label: 'Register', href: '/register', active: true },
          ]} 
        />
        <RegisterForm />
        
        <p className="mt-6 text-center text-xs text-muted-foreground leading-relaxed">
          By clicking &quot;Get Started&quot;, you agree to our{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link> and{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
        </p>
      </AuthCard>
    </div>
  )
}
