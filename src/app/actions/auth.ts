'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';

const RegisterSchema = z.object({
  firstName: z.string().min(2, 'First name is too short'),
  lastName: z.string().min(2, 'Last name is too short'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

export async function registerUser(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  
  const validated = RegisterSchema.safeParse(rawData);
  
  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { firstName, lastName, email, password } = validated.data;

  try {
    const hashedPassword = await hash(password, 10);

    const [newUser] = await db.insert(users).values({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    }).returning({ id: users.id });

    // Set a session cookie
    const cookieStore = await cookies();
    cookieStore.set('user_id', newUser.id, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });
  } catch (error: any) {
    console.error('Registration Error:', error);
    if (error.code === '23505') {
      return { error: 'Email already exists' };
    }
    return { error: `Database Error: ${error.message || 'Unknown error'}` };
  }

  redirect('/onboarding');
}

const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export async function loginUser(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = LoginSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { email, password } = validated.data;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      return { error: 'Invalid email or password' };
    }

    const passwordMatch = await import('bcryptjs').then(m => m.compare(password, user.password));

    if (!passwordMatch) {
      return { error: 'Invalid email or password' };
    }

    // Set a session cookie
    const cookieStore = await cookies();
    cookieStore.set('user_id', user.id, { 
      httpOnly: true, 
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
    });

    if (!user.isOnboarded) {
      redirect('/onboarding');
    }

    redirect('/dashboard');
  } catch (error: any) {
    if (error.digest?.includes('NEXT_REDIRECT')) throw error;
    console.error('Login Error:', error);
    return { error: 'Something went wrong. Please try again.' };
  }
}

const OnboardingSchema = z.object({
  orgName: z.string().min(2, 'Organization name is too short'),
  role: z.string().min(2, 'Role is required'),
  industry: z.string().min(2, 'Industry is required'),
});

export async function completeOnboarding(formData: FormData) {
  const cookieStore = await cookies();
  const userId = cookieStore.get('user_id')?.value;

  if (!userId) {
    redirect('/register');
  }

  const rawData = Object.fromEntries(formData.entries());
  const validated = OnboardingSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { orgName, role, industry } = validated.data;

  try {
    await db.update(users)
      .set({
        organizationName: orgName,
        role,
        industry,
        isOnboarded: true,
      })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error('Onboarding Error:', error);
    return { error: 'Failed to complete setup' };
  }

  redirect('/dashboard');
}
