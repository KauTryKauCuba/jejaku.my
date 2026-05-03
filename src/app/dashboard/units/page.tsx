// Individual Units Page
import React from 'react';
import { db } from '@/db';
import { itemUnits, items, locations, users } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { UnitListClient } from '../../../components/inventory/UnitListClient';

export default async function UnitsPage() {
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

  // Fetch all units with their product and location
  const dbUnits = await db.query.itemUnits.findMany({
    with: {
      item: true,
      location: true,
    },
    orderBy: [desc(itemUnits.createdAt)],
  });

  // Filter units belonging to the organization's items
  // (In a real app, we'd add organizationId to itemUnits, 
  // but for now we filter by the item's organizationId)
  const orgUnits = dbUnits.filter(u => u.item.organizationId === user.organizationId);

  const formattedUnits = orgUnits.map(u => ({
    id: u.id,
    serialNumber: u.serialNumber,
    productName: u.item.name,
    sku: u.item.sku,
    locationName: u.location.name,
    status: u.status,
    createdAt: u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'N/A',
  }));

  const stats = {
    total: formattedUnits.length,
    available: formattedUnits.filter(u => u.status === 'AVAILABLE').length,
    sold: formattedUnits.filter(u => u.status === 'SOLD').length,
  };

  return (
    <React.Suspense fallback={<div className="p-8 text-center">Loading units...</div>}>
      <UnitListClient 
        initialUnits={formattedUnits} 
        stats={stats}
      />
    </React.Suspense>
  );
}
