'use client';

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Mail, Loader2 } from 'lucide-react';
import { loginUser } from '@/app/actions/auth';

export function LoginForm() {
  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await loginUser(formData);
  }, null);

  return (
    <form action={action} className="space-y-4">
      {state?.error && (
        <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-lg text-center">
          {state.error}
        </div>
      )}
      
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
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Password</Label>
          <button type="button" className="text-xs text-primary hover:underline underline-offset-4">
            Forgot password?
          </button>
        </div>
        <Input 
          id="password" 
          name="password"
          type="password" 
          placeholder="••••••••" 
          required 
          className="!transition-none" 
          disabled={isPending}
        />
      </div>

      <Button 
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-xl text-base bg-primary text-primary-foreground hover:opacity-90 mt-2 !transition-none"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </Button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
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
