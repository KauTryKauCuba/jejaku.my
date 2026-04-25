import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/SiteLogo'
import { AuthCard } from '@/components/ui/AuthCard'
import { ArrowLeft } from 'lucide-react'
import { LoginForm } from '@/components/auth/LoginForm'
import { Tabs } from '@/components/ui/Tabs'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your account to manage your projects.',
}

export default function LoginPage() {
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
          <Logo className="h-5" />
        </Link>
      </div>

      <AuthCard 
        title="Welcome back" 
        description="Sign in to your account to continue"
      >
        <Tabs 
          tabs={[
            { id: 'login', label: 'Login', href: '/login', active: true },
            { id: 'register', label: 'Register', href: '/register', active: false },
          ]} 
        />
        <LoginForm />
      </AuthCard>
    </div>
  )
}
