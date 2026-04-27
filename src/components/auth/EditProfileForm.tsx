'use client';

import React, { useActionState, useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { updateProfile } from '@/app/actions/auth';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/Select';
import { Building2, UserCircle, Briefcase, Loader2, Mail, CheckCircle2 } from 'lucide-react';

interface EditProfileFormProps {
  user: {
    name: string;
    email: string;
    organizationName: string | null;
    role: string | null;
    industry: string | null;
  };
}

export function EditProfileForm({ user }: EditProfileFormProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await updateProfile(formData);
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }
    return result;
  }, null);

  return (
    <form action={action} className="space-y-6 max-w-2xl">
      {state?.error && (
        <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 rounded-lg text-center">
          {state.error}
        </div>
      )}

      {showSuccess && (
        <div className="p-3 text-sm font-medium text-emerald-500 bg-emerald-500/10 rounded-lg text-center flex items-center justify-center gap-2 animate-in fade-in zoom-in duration-300">
          <CheckCircle2 className="size-4" />
          Profile updated successfully
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <div className="relative">
            <UserCircle className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input 
              id="name" 
              name="name"
              defaultValue={user.name}
              placeholder="John Doe" 
              required 
              className="pl-10 !transition-none" 
              disabled={isPending}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <div className="relative opacity-60">
            <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input 
              id="email" 
              value={user.email} 
              readOnly 
              disabled
              className="pl-10 bg-muted/30 border-transparent text-sm" 
            />
          </div>
          <p className="text-[10px] text-muted-foreground ml-1">Email cannot be changed.</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="orgName">Company Name</Label>
          <div className="relative">
            <Building2 className="absolute left-3 top-3 size-4 text-muted-foreground" />
            <Input 
              id="orgName" 
              name="orgName"
              defaultValue={user.organizationName || ''}
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
              defaultValue={user.role || ''}
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
              defaultValue={user.industry || ''}
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
      </div>

      <div className="pt-4 flex justify-end">
        <Button 
          type="submit"
          disabled={isPending}
          className="px-8 h-11 rounded-xl text-sm bg-primary text-primary-foreground hover:opacity-90 !transition-none"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving changes...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
}
