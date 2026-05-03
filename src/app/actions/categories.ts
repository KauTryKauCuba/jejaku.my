'use server';

import { db } from '@/db';
import { categories, items } from '@/db/schema';
import { getSession } from '@/lib/session';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { eq, and, inArray } from 'drizzle-orm';

const CategorySchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  description: z.string().optional().nullable(),
});

export async function addCategory(formData: FormData) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) return { error: 'Unauthorized' };

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!currentUser?.organizationId) return { error: 'No organization found' };

  const rawData = Object.fromEntries(formData.entries());
  const validated = CategorySchema.safeParse(rawData);

  if (!validated.success) return { error: validated.error.issues[0].message };

  const { name, description } = validated.data;

  try {
    const [newCategory] = await db.insert(categories).values({
      organizationId: currentUser.organizationId,
      name,
      description,
    }).returning();

    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/items');
    return { success: true, category: newCategory };
  } catch (error) {
    console.error('Add Category Error:', error);
    return { error: 'Failed to add category' };
  }
}

export async function updateCategory(id: string, formData: FormData) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) return { error: 'Unauthorized' };

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!currentUser?.organizationId) return { error: 'No organization found' };

  const rawData = Object.fromEntries(formData.entries());
  const validated = CategorySchema.safeParse(rawData);

  if (!validated.success) return { error: validated.error.issues[0].message };

  const { name, description } = validated.data;

  try {
    await db.update(categories)
      .set({
        name,
        description,
      })
      .where(and(
        eq(categories.id, id),
        eq(categories.organizationId, currentUser.organizationId)
      ));

    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/items');
    return { success: true };
  } catch (error) {
    console.error('Update Category Error:', error);
    return { error: 'Failed to update category' };
  }
}

export async function deleteCategory(id: string) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) return { error: 'Unauthorized' };

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!currentUser?.organizationId) return { error: 'No organization found' };

  try {
    // Check if any items are using this category
    const itemsUsingCategory = await db.query.items.findFirst({
      where: and(
        eq(items.categoryId, id),
        eq(items.organizationId, currentUser.organizationId)
      )
    });

    if (itemsUsingCategory) {
      return { error: 'Cannot delete category while items are assigned to it. Please reassign items first.' };
    }

    await db.delete(categories)
      .where(and(
        eq(categories.id, id),
        eq(categories.organizationId, currentUser.organizationId)
      ));

    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/items');
    return { success: true };
  } catch (error) {
    console.error('Delete Category Error:', error);
    return { error: 'Failed to delete category' };
  }
}

export async function bulkDeleteCategories(ids: string[]) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) return { error: 'Unauthorized' };

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!currentUser?.organizationId) return { error: 'No organization found' };

  try {
    // Check if any items are using these categories
    const itemsUsingCategories = await db.query.items.findFirst({
      where: and(
        inArray(items.categoryId, ids),
        eq(items.organizationId, currentUser.organizationId)
      )
    });

    if (itemsUsingCategories) {
      return { error: 'One or more categories are being used by items and cannot be deleted.' };
    }

    await db.delete(categories)
      .where(and(
        inArray(categories.id, ids),
        eq(categories.organizationId, currentUser.organizationId)
      ));

    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/items');
    return { success: true };
  } catch (error) {
    console.error('Bulk Delete Categories Error:', error);
    return { error: 'Failed to delete categories' };
  }
}
