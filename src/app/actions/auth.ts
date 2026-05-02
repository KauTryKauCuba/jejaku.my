'use server';

import { db } from '@/db';
import { users, organizations } from '@/db/schema';
import { hash } from 'bcryptjs';
import { z } from 'zod';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { eq } from 'drizzle-orm';
import { createSession, getSession, deleteSession } from '@/lib/session';


const RegisterSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter'),
});

export async function registerUser(formData: FormData) {
  const rawData = Object.fromEntries(formData.entries());
  const validated = RegisterSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, email, password } = validated.data;
  
  try {
    const hashedPassword = await hash(password, 10);
    const userId = crypto.randomUUID();

    const [newUser] = await db.insert(users).values({
      id: userId,
      name,
      email,
      password: hashedPassword,
    }).returning({ id: users.id });

    // Create a signed session
    await createSession(newUser.id);
  } catch (error: any) {
    const errorCode = error.code || error.cause?.code;
    if (errorCode === '23505') {
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

    // Create a signed session
    await createSession(user.id);

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
  const session = await getSession();
  const userId = session?.userId;

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
    // 1. Create organization
    const [newOrg] = await db.insert(organizations).values({
      name: orgName,
      industry: industry,
    }).returning();

    // 2. Update user to link to organization
    await db.update(users)
      .set({
        organizationId: newOrg.id,
        role,
        isOnboarded: true,
      })
      .where(eq(users.id, userId));
  } catch (error) {
    console.error('Onboarding Error:', error);
    return { error: 'Failed to complete setup' };
  }

  redirect('/dashboard');
}

export async function logoutUser() {
  await deleteSession();
  redirect('/login');
}

const UpdateProfileSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  orgName: z.string().min(2, 'Organization name is too short'),
  role: z.string().min(2, 'Role is required'),
  industry: z.string().min(2, 'Industry is required'),
});

export async function updateProfile(formData: FormData) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const validated = UpdateProfileSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, orgName, role, industry } = validated.data;

  try {
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
    });

    if (!user) {
      return { error: 'User not found' };
    }

    // 1. Update user
    await db.update(users)
      .set({
        name,
        role,
        updatedAt: new Date(),
      })
      .where(eq(users.id, userId));
    
    // 2. Update organization
    if (user.organizationId) {
      await db.update(organizations)
        .set({
          name: orgName,
          industry,
          updatedAt: new Date(),
        })
        .where(eq(organizations.id, user.organizationId));
    }
    
    return { success: true };
  } catch (error) {
    console.error('Update Profile Error:', error);
    return { error: 'Failed to update profile' };
  }
}
