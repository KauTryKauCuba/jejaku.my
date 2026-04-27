'use client';

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Mail, ShieldCheck, Loader2 } from 'lucide-react';
import { registerUser } from '@/app/actions/auth';

export function RegisterForm() {
  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await registerUser(formData);
  }, null);

  return (
    <form action={action} className="space-y-3">
      {state?.error && (
        <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-lg text-center">
          {state.error}
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input 
          id="name" 
          name="name"
          placeholder="John Doe" 
          required 
          className="!transition-none" 
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email address</Label>
        <Input 
          id="email" 
          name="email"
          type="email" 
          placeholder="name@example.com" 
          required 
          className="!transition-none" 
          disabled={isPending}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input 
          id="password" 
          name="password"
          type="password" 
          placeholder="••••••••" 
          required 
          className="!transition-none" 
          disabled={isPending}
        />
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <ShieldCheck className="size-3 text-primary" />
          Must be at least 8 characters with a number
        </p>
      </div>

      <Button 
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-xl text-base bg-primary text-primary-foreground hover:opacity-90 mt-2 !transition-none"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4" />
            Creating account...
          </>
        ) : (
          'Get Started'
        )}
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

      <div className="space-y-3">
        <Button variant="outline" type="button" className="w-full rounded-xl h-11 !transition-none" disabled={isPending}>
          <Mail className="mr-2 size-4" />
          Continue with Google
        </Button>
      </div>
    </form>
  );
}
