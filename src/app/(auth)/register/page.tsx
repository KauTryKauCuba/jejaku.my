import React from 'react'
import Link from 'next/link'
import { Logo } from '@/components/ui/SiteLogo'
import { AuthCard } from '@/components/ui/AuthCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { ArrowLeft, Code2, Mail, ShieldCheck } from 'lucide-react'

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

      <div className="mb-6">
        <Link href="/">
          <Logo className="h-8" />
        </Link>
      </div>

      <AuthCard 
        title="Create Account" 
        description="Join thousands of teams building better customer engagement"
      >
        <form className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input id="firstName" placeholder="John" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input id="lastName" placeholder="Doe" required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email address</Label>
            <Input id="email" type="email" placeholder="name@example.com" required />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" placeholder="••••••••" required />
            <p className="text-[10px] text-muted-foreground flex items-center gap-1">
              <ShieldCheck className="size-3 text-primary" />
              Must be at least 8 characters with a number
            </p>
          </div>

          <Button className="w-full h-11 rounded-xl text-base bg-brand-gradient hover:opacity-90 border-0 mt-2">
            Get Started
          </Button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or sign up with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button variant="outline" className="rounded-xl h-11">
              <Code2 className="mr-2 size-4" />
              GitHub
            </Button>
            <Button variant="outline" className="rounded-xl h-11">
              <Mail className="mr-2 size-4" />
              Google
            </Button>
          </div>
        </form>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <Link href="/login" className="text-primary font-semibold hover:underline">
            Sign in
          </Link>
        </div>
        
        <p className="mt-6 text-center text-[11px] text-muted-foreground leading-relaxed">
          By clicking &quot;Get Started&quot;, you agree to our{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">Terms of Service</Link> and{' '}
          <Link href="#" className="underline underline-offset-4 hover:text-primary">Privacy Policy</Link>.
        </p>
      </AuthCard>
    </div>
  )
}
