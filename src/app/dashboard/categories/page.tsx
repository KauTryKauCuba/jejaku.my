import React from 'react';
export const dynamic = 'force-dynamic';
import { db } from '@/db';
import { categories, users, items } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { CategoryListClient } from '@/components/inventory/CategoryListClient';

export default async function CategoriesPage() {
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

  // Fetch categories with item counts
  const dbCategories = await db.query.categories.findMany({
    where: eq(categories.organizationId, user.organizationId),
    orderBy: (categories, { desc }) => [desc(categories.createdAt)],
  });

  // Get item counts per category
  const itemCounts = await db
    .select({
      categoryId: items.categoryId,
      count: sql<number>`count(*)::int`,
    })
    .from(items)
    .where(eq(items.organizationId, user.organizationId))
    .groupBy(items.categoryId);

  const countsMap = Object.fromEntries(
    itemCounts.map((c) => [c.categoryId, c.count])
  );

  const formattedCategories = dbCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description || 'No description',
    itemCount: countsMap[cat.id] || 0,
    createdAt: cat.createdAt.toLocaleDateString(),
  }));

  // Stats for the header
  const totalCategories = formattedCategories.length;
  const totalItemsCategorized = (Object.values(countsMap) as number[]).reduce((a, b) => a + b, 0);

  return (
    <CategoryListClient 
      initialCategories={formattedCategories} 
      stats={{
        total: totalCategories,
        totalItems: totalItemsCategorized,
      }}
    />
  );
}
