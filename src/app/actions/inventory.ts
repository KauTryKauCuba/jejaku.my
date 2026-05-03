'use server';

import { db } from '@/db';
import { items, stockMovements, stockLevels, locations, itemUnits } from '@/db/schema';
import { getSession } from '@/lib/session';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { eq, and, sql, inArray, desc } from 'drizzle-orm';

export async function bulkDeleteItems(ids: string[]) {
  const session = await getSession();
  const userId = session?.userId;
  if (!userId) return { error: 'Unauthorized' };

  const user = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!user?.organizationId) return { error: 'No organization found' };

  try {
    await db.delete(items)
      .where(and(
        inArray(items.id, ids),
        eq(items.organizationId, user.organizationId)
      ));
    
    revalidatePath('/dashboard/items');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (error) {
    console.error('Bulk Delete Error:', error);
    return { error: 'Failed to delete items' };
  }
}

const ItemSchema = z.object({
  name: z.string().min(2, 'Name is too short'),
  sku: z.string().min(2, 'SKU is required'),
  categoryId: z.string().uuid().optional().nullable(),
  trackingType: z.enum(['QUANTITY', 'SERIALIZED']).default('QUANTITY'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  minStock: z.coerce.number().min(0),
  unit: z.string().default('pcs'),
  imageUrl: z.string().optional().nullable(),
  qrCode: z.string().optional().nullable(),
});

const StockInSchema = z.object({
  itemId: z.string().uuid('Invalid item'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  locationId: z.string().uuid('Invalid location'),
  reason: z.string().optional(),
  serialNumbers: z.string().optional(), // Comma separated serials
});

const StockOutSchema = z.object({
  itemId: z.string().uuid('Invalid item'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  locationId: z.string().uuid('Invalid location'),
  reason: z.string().optional(),
  unitIds: z.string().optional(), // Comma separated unit IDs for serialized items
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
  console.log('AddItem FormData Keys:', Object.keys(rawData));
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
      return { error: 'SKU already exists' };
    }

    const imageFile = formData.get('image') as File;
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      console.log('Processing image upload:', imageFile.name, imageFile.type, imageFile.size);
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
      console.log('Image converted to base64, length:', imageUrl.length);
    }

    // Generate unique QR code
    const qrCode = `JKQ-QR-${Math.random().toString(36).substring(2, 12).toUpperCase()}`;

    // 2. Insert Item
    const [newItem] = await db.insert(items).values({
      organizationId: currentUser.organizationId,
      categoryId: categoryId || null,
      name,
      sku,
      trackingType: (rawData.trackingType as any) || 'QUANTITY',
      price,
      minStock,
      unit,
      imageUrl: imageUrl || validated.data.imageUrl,
      qrCode,
    }).returning();
    
    console.log('New Item added successfully:', { id: newItem.id, name: newItem.name, hasImage: !!newItem.imageUrl });

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

    if (existing) return { error: 'SKU already exists for another product' };

    const imageFile = formData.get('image') as File;
    let imageUrl = null;
    if (imageFile && imageFile.size > 0) {
      const buffer = Buffer.from(await imageFile.arrayBuffer());
      imageUrl = `data:${imageFile.type};base64,${buffer.toString('base64')}`;
    }

    await db.update(items)
      .set({
        name,
        sku,
        categoryId: categoryId || null,
        trackingType: (rawData.trackingType as any) || 'QUANTITY',
        price,
        minStock,
        unit,
        imageUrl: imageUrl || validated.data.imageUrl,
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

export async function stockIn(formData: FormData) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) return { error: 'Unauthorized' };

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!currentUser?.organizationId) return { error: 'No organization found' };

  const rawData = Object.fromEntries(formData.entries());
  const validated = StockInSchema.safeParse(rawData);

  if (!validated.success) return { error: validated.error.issues[0].message };

  const { itemId, quantity, locationId, reason, serialNumbers } = validated.data;

  try {
    // 0. Verify item belongs to organization
    const item = await db.query.items.findFirst({
      where: and(
        eq(items.id, itemId),
        eq(items.organizationId, currentUser.organizationId)
      )
    });

    if (!item) return { error: 'Item not found' };

    // 1. Handle Serialized Items
    if (item.trackingType === 'SERIALIZED') {
      const serials = serialNumbers?.split(',').map(s => s.trim()).filter(Boolean) || [];
      if (serials.length !== quantity) {
        return { error: `Please provide exactly ${quantity} serial numbers.` };
      }

      // Check for duplicate serials in this item
      const existingSerials = await db.query.itemUnits.findMany({
        where: and(
          eq(itemUnits.itemId, itemId),
          inArray(itemUnits.serialNumber, serials)
        )
      });

      if (existingSerials.length > 0) {
        return { error: `Serial number(s) already exist: ${existingSerials.map(s => s.serialNumber).join(', ')}` };
      }

      // Create unit records
      for (const sn of serials) {
        await db.insert(itemUnits).values({
          itemId,
          locationId,
          serialNumber: sn,
          status: 'AVAILABLE',
        });
      }
    }

    // 2. Update or Insert Stock Level
    const existingStock = await db.query.stockLevels.findFirst({
      where: and(
        eq(stockLevels.itemId, itemId),
        eq(stockLevels.locationId, locationId)
      )
    });

    if (existingStock) {
      await db.update(stockLevels)
        .set({ 
          quantity: existingStock.quantity + quantity,
          updatedAt: new Date()
        })
        .where(eq(stockLevels.id, existingStock.id));
    } else {
      await db.insert(stockLevels).values({
        itemId,
        locationId,
        quantity,
      });
    }

    // 3. Record Movement
    await db.insert(stockMovements).values({
      organizationId: currentUser.organizationId,
      itemId,
      userId,
      toLocationId: locationId,
      type: 'IN',
      quantity,
      reason: reason || 'Stock In',
    });

    revalidatePath('/dashboard/items');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/stock-in');
    return { success: true };
  } catch (error) {
    console.error('Stock In Error:', error);
    return { error: 'Failed to add stock' };
  }
}

export async function stockOut(formData: FormData) {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) return { error: 'Unauthorized' };

  const currentUser = await db.query.users.findFirst({
    where: (users, { eq }) => eq(users.id, userId),
  });

  if (!currentUser?.organizationId) return { error: 'No organization found' };

  const rawData = Object.fromEntries(formData.entries());
  const validated = StockOutSchema.safeParse(rawData);

  if (!validated.success) return { error: validated.error.issues[0].message };

  const { itemId, quantity, locationId, reason, unitIds } = validated.data;

  try {
    // 0. Verify item belongs to organization
    const item = await db.query.items.findFirst({
      where: and(
        eq(items.id, itemId),
        eq(items.organizationId, currentUser.organizationId)
      )
    });

    if (!item) return { error: 'Item not found' };

    // 1. Handle Serialized Items
    if (item.trackingType === 'SERIALIZED') {
      const ids = unitIds?.split(',').map(id => id.trim()).filter(Boolean) || [];
      if (ids.length !== quantity) {
        return { error: `Please select exactly ${quantity} units.` };
      }

      // Update unit status
      await db.update(itemUnits)
        .set({ status: 'SOLD', updatedAt: new Date() })
        .where(and(
          inArray(itemUnits.id, ids),
          eq(itemUnits.itemId, itemId)
        ));
    }

    // 2. Check current stock level
    const existingStock = await db.query.stockLevels.findFirst({
      where: and(
        eq(stockLevels.itemId, itemId),
        eq(stockLevels.locationId, locationId)
      )
    });

    if (!existingStock || existingStock.quantity < quantity) {
      return { error: `Insufficient stock. Current quantity: ${existingStock?.quantity || 0}` };
    }

    // 3. Update Stock Level
    await db.update(stockLevels)
      .set({ 
        quantity: existingStock.quantity - quantity,
        updatedAt: new Date()
      })
      .where(eq(stockLevels.id, existingStock.id));

    // 4. Record Movement
    await db.insert(stockMovements).values({
      organizationId: currentUser.organizationId,
      itemId,
      userId,
      fromLocationId: locationId,
      type: 'OUT',
      quantity: -quantity, // Negative for OUT
      reason: reason || 'Stock Out / Sale',
    });

    revalidatePath('/dashboard/items');
    revalidatePath('/dashboard');
    revalidatePath('/dashboard/stock-out');
    revalidatePath('/dashboard/transactions');
    return { success: true };
  } catch (error) {
    console.error('Stock Out Error:', error);
    return { error: 'Failed to remove stock' };
  }
}

