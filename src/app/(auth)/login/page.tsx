import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/SiteLogo'
import { AuthCard } from '@/components/ui/AuthCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { ArrowLeft, Code2, Mail } from 'lucide-react'
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
        title="Welcome Back" 
        description="Enter your credentials to access your account"
      >
        <Tabs 
          tabs={[
            { id: 'login', label: 'Login', href: '/login', active: true },
            { id: 'register', label: 'Register', href: '/register', active: false },
          ]} 
        />
        <form className="space-y-3">
          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input 
              id="email" 
              type="email" 
              placeholder="name@example.com" 
              required 
              className="!transition-none"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link 
                href="/forgot-password" 
                className="text-xs text-primary hover:underline font-medium"
              >
                Forgot password?
              </Link>
            </div>
            <Input 
              id="password" 
              type="password" 
              placeholder="••••••••" 
              required 
              className="!transition-none"
            />
          </div>

          <Button className="w-full h-11 rounded-xl text-base bg-brand-gradient hover:opacity-90 border-0 !transition-none">
            Sign In
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="rounded-xl h-11 !transition-none">
              <Code2 className="mr-2 size-4" />
              GitHub
            </Button>
            <Button variant="outline" className="rounded-xl h-11 !transition-none">
              <Mail className="mr-2 size-4" />
              Google
            </Button>
          </div>
        </form>
      </AuthCard>
    </div>
  )
}
