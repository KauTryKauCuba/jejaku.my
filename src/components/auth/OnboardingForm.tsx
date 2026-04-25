'use client';

import React, { useActionState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { completeOnboarding } from '@/app/actions/auth';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/Select';
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
          <UserCircle className="absolute left-3 top-3 size-4 text-muted-foreground z-10 pointer-events-none" />
          <Select 
            name="role"
            required 
            defaultValue=""
            disabled={isPending}
          >
            <SelectTrigger className="pl-10 !transition-none">
              <SelectValue placeholder="Select your role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="CEO">CEO / Founder</SelectItem>
              <SelectItem value="Manager">Manager</SelectItem>
              <SelectItem value="Operations">Operations</SelectItem>
              <SelectItem value="Owner">Business Owner</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="industry">Industry</Label>
        <div className="relative">
          <Briefcase className="absolute left-3 top-3 size-4 text-muted-foreground z-10 pointer-events-none" />
          <Select 
            name="industry"
            required 
            defaultValue=""
            disabled={isPending}
          >
            <SelectTrigger className="pl-10 !transition-none">
              <SelectValue placeholder="Select industry" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Retail">Retail</SelectItem>
              <SelectItem value="Technology">Technology</SelectItem>
              <SelectItem value="Hospitality">Hospitality</SelectItem>
              <SelectItem value="Healthcare">Healthcare</SelectItem>
              <SelectItem value="Education">Education</SelectItem>
              <SelectItem value="Real Estate">Real Estate</SelectItem>
              <SelectItem value="Logistics">Logistics & Transport</SelectItem>
              <SelectItem value="Manufacturing">Manufacturing</SelectItem>
              <SelectItem value="Services">Professional Services</SelectItem>
              <SelectItem value="Other">Other</SelectItem>
            </SelectContent>
          </Select>
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
