import React from 'react';
export const dynamic = 'force-dynamic';
import { db } from '@/db';
import { items, organizations, users, categories, stockLevels } from '@/db/schema';
import { eq, and, sql } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { ItemListClient } from '@/components/inventory/ItemListClient';

export default async function ItemListPage() {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    redirect('/login');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user?.organizationId) {
    redirect('/onboarding');
  }

  // Fetch real items with their stock levels and categories
  const dbItems = await db.query.items.findMany({
    where: eq(items.organizationId, user.organizationId),
    with: {
      category: true,
      stockLevels: true,
    },
    orderBy: (items, { desc }) => [desc(items.createdAt)],
  });

  // Calculate stats
  const totalItems = dbItems.length;
  const lowStockCount = dbItems.filter(item => {
    const totalStock = item.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0);
    return totalStock > 0 && totalStock <= item.minStock;
  }).length;
  const outOfStockCount = dbItems.filter(item => {
    const totalStock = item.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0);
    return totalStock === 0;
  }).length;

  // Transform data for the UI
  const formattedItems = dbItems.map(item => {
    const totalStock = item.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0);
    let status = 'In Stock';
    if (totalStock === 0) status = 'Out of Stock';
    else if (totalStock <= item.minStock) status = 'Low Stock';

    return {
      id: item.id,
      name: item.name,
      sku: item.sku,
      category: item.category?.name || 'Uncategorized',
      stock: totalStock,
      minStock: item.minStock,
      price: `RM ${parseFloat(item.price || '0').toFixed(2)}`,
      status,
      unit: item.unit || 'pcs',
      imageUrl: item.imageUrl,
      qrCode: item.qrCode,
    };
  });

  return (
    <ItemListClient 
      initialItems={formattedItems} 
      stats={{
        total: totalItems,
        lowStock: lowStockCount,
        outOfStock: outOfStockCount
      }}
    />
  );
}
