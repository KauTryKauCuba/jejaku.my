import React from 'react';
import { db } from '@/db';
import { stockMovements, users, items } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { TransactionListClient } from '../../../components/inventory/TransactionListClient';
import { 
  History as HistoryIcon, 
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRightLeft,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';

export default async function TransactionsPage() {
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

  // Fetch all transactions (stock movements)
  const dbMovements = await db.query.stockMovements.findMany({
    where: eq(stockMovements.organizationId, user.organizationId),
    with: {
      item: true,
      user: true,
      fromLocation: true,
      toLocation: true,
    },
    orderBy: [desc(stockMovements.createdAt)],
  });

  // Calculate some basic stats for the grid
  const totalMovements = dbMovements.length;
  const stockInCount = dbMovements.filter(m => m.type === 'IN').length;
  const stockOutCount = dbMovements.filter(m => m.type === 'OUT').length;

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight flex items-center gap-2">
            <HistoryIcon className="size-6 text-primary" />
            Transaction History
          </h1>
          <p className="text-muted-foreground mt-1 text-sm font-normal">
            Monitor all stock movements, adjustments and warehouse activities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2 font-normal">
            <FileText className="size-4" />
            Export Log
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border bg-card flex items-center gap-4">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <HistoryIcon className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Logs</p>
            <p className="text-lg font-bold">{totalMovements}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card flex items-center gap-4">
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <ArrowUpRight className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Stock In</p>
            <p className="text-lg font-bold text-emerald-500">{stockInCount}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card flex items-center gap-4">
          <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <ArrowDownRight className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Stock Out</p>
            <p className="text-lg font-bold text-amber-500">{stockOutCount}</p>
          </div>
        </div>
      </div>

      <TransactionListClient initialMovements={dbMovements} />
    </div>
  );
}
