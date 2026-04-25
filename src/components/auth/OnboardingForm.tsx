'use client';

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { completeOnboarding } from '@/app/actions/auth';
import { Select } from '@/components/ui/Select';
import { Building2, UserCircle, Briefcase, Loader2 } from 'lucide-react';

export function OnboardingForm() {
  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    return await completeOnboarding(formData);
  }, null);

  return (
    <form action={action} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="orgName">Organization Name</Label>
        <div className="relative">
          <Building2 className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            id="orgName" 
            name="orgName"
            placeholder="Acme Inc." 
            required 
            className="pl-10 !transition-none" 
            disabled={isPending}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Your Role</Label>
        <div className="relative">
          <UserCircle className="absolute left-3 top-3 size-4 text-muted-foreground z-10" />
          <Select 
            id="role" 
            name="role"
            required 
            defaultValue=""
            className="pl-10 !transition-none" 
            disabled={isPending}
          >
            <option value="" disabled>Select your role</option>
            <option value="CEO">CEO / Founder</option>
            <option value="Manager">Manager</option>
            <option value="Operations">Operations</option>
            <option value="Owner">Business Owner</option>
            <option value="Other">Other</option>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-3 size-4 text-muted-foreground" />
          <Input 
            id="industry" 
            name="industry"
            placeholder="Retail, Tech, Hospitality..." 
            required 
            className="pl-10 !transition-none" 
            disabled={isPending}
          />
        </div>
      </div>

      <Button 
        type="submit"
        disabled={isPending}
        className="w-full h-11 rounded-xl text-base bg-primary text-primary-foreground hover:opacity-90 mt-4 !transition-none"
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Setting up...
          </>
        ) : (
          'Complete Setup'
        )}
      </Button>
    </form>
  );
}
