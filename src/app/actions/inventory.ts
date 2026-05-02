'use server';

import { db } from '@/db';
import { items, stockMovements, stockLevels, locations } from '@/db/schema';
import { getSession } from '@/lib/session';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { eq, and, sql } from 'drizzle-orm';

const ItemSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  sku: z.string().min(2, 'SKU is required'),
  categoryId: z.string().uuid().optional().nullable(),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  minStock: z.coerce.number().min(0),
  unit: z.string().default('pcs'),
});

export async function addItem(formData: FormData) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    return { error: 'Unauthorized' };
  }

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!currentUser?.organizationId) {
    return { error: 'No organization found' };
  }

  const rawData = Object.fromEntries(formData.entries());
  const validated = ItemSchema.safeParse(rawData);

  if (!validated.success) {
    return { error: validated.error.issues[0].message };
  }

  const { name, sku, categoryId, price, minStock, unit } = validated.data;

  try {
    // 1. Check if SKU already exists in organization
    const existing = await db.query.items.findFirst({
      where: and(
        eq(items.organizationId, currentUser.organizationId),
        eq(items.sku, sku)
      )
    });

    if (existing) {
      return { error: 'SKU already exists in your inventory' };
    }

    // 2. Insert Item
    const [newItem] = await db.insert(items).values({
      organizationId: currentUser.organizationId,
      categoryId: categoryId || null,
      name,
      sku,
      price,
      minStock,
      unit,
    }).returning();

    // 3. Initialize stock levels if a default location exists
    const defaultLocation = await db.query.locations.findFirst({
      where: and(
        eq(locations.organizationId, currentUser.organizationId),
        eq(locations.isDefault, true)
      )
    });

    if (defaultLocation) {
      await db.insert(stockLevels).values({
        itemId: newItem.id,
        locationId: defaultLocation.id,
        quantity: 0,
      });
    }

    revalidatePath('/dashboard/items');
    revalidatePath('/dashboard');
    return { success: true, item: newItem };
  } catch (error) {
    console.error('Add Item Error:', error);
    return { error: 'Failed to add item' };
  }
}

export async function updateItem(id: string, formData: FormData) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) return { error: 'Unauthorized' };

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!currentUser?.organizationId) return { error: 'No organization found' };

  const rawData = Object.fromEntries(formData.entries());
  const validated = ItemSchema.safeParse(rawData);

  if (!validated.success) return { error: validated.error.issues[0].message };

  const { name, sku, categoryId, price, minStock, unit } = validated.data;

  try {
    // Check SKU uniqueness (excluding current item)
    const existing = await db.query.items.findFirst({
      where: and(
        eq(items.organizationId, currentUser.organizationId),
        eq(items.sku, sku),
        sql`${items.id} != ${id}`
      )
    });

    if (existing) return { error: 'SKU already exists in your inventory' };

    await db.update(items)
      .set({
        name,
        sku,
        categoryId: categoryId || null,
        price,
        minStock,
        unit,
        updatedAt: new Date(),
      })
      .where(and(
        eq(items.id, id),
        eq(items.organizationId, currentUser.organizationId)
      ));

    revalidatePath('/dashboard/items');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Update Item Error:', error);
    return { error: 'Failed to update item' };
  }
}

export async function deleteItem(id: string) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) return { error: 'Unauthorized' };

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!currentUser?.organizationId) return { error: 'No organization found' };

  try {
    await db.delete(items)
      .where(and(
        eq(items.id, id),
        eq(items.organizationId, currentUser.organizationId)
      ));

    revalidatePath('/dashboard/items');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Delete Item Error:', error);
    return { error: 'Failed to delete item' };
  }
}

