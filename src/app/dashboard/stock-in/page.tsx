import React from 'react';
import { db } from '@/db';
import { items, locations, stockMovements, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { StockInForm } from '@/components/inventory/StockInForm';
import { 
  ArrowLeft, 
  ArrowDownToLine, 
  History as HistoryIcon, 
  Package, 
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default async function StockInPage() {
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

  // Fetch items for selection
  const dbItems = await db.query.items.findMany({
    where: eq(items.organizationId, user.organizationId),
    with: {
      stockLevels: true,
    },
    orderBy: (items, { asc }) => [asc(items.name)],
  });

  // Fetch locations
  const dbLocations = await db.query.locations.findMany({
    where: eq(locations.organizationId, user.organizationId),
  });

  // Fetch recent stock in movements
  const recentStockIns = await db.query.stockMovements.findMany({
    where: and(
      eq(stockMovements.organizationId, user.organizationId),
      eq(stockMovements.type, 'IN')
    ),
    with: {
      item: true,
    },
    limit: 5,
    orderBy: [desc(stockMovements.createdAt)],
  });

  // Calculate stats
  const lowStockItems = dbItems.filter(item => {
    const totalStock = item.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0);
    return totalStock <= item.minStock;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Stock In</h1>
          <p className="text-muted-foreground mt-1 text-sm font-normal">
            Add new inventory stock to your warehouse locations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2 font-normal" asChild>
            <Link href="/dashboard/items">
              <Package className="size-4" />
              View Inventory
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border bg-card flex items-center gap-4">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ArrowDownToLine className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Arrivals</p>
            <p className="text-lg font-bold">{recentStockIns.length}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card flex items-center gap-4">
          <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Needs Restock</p>
            <p className="text-lg font-bold text-amber-500">{lowStockItems.length}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card flex items-center gap-4">
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <TrendingUp className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Items Ready</p>
            <p className="text-lg font-bold text-emerald-500">{dbItems.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="p-6 border-b bg-muted/20">
              <h2 className="text-sm font-bold flex items-center gap-2">
                <Plus className="size-4 text-primary" />
                Record New Arrival
              </h2>
            </div>
            <div className="p-6">
              <StockInForm items={dbItems} locations={dbLocations} />
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <HistoryIcon className="size-4 text-primary" />
                Recent Arrivals
              </h3>
              <Button variant="link" className="p-0 h-auto text-xs text-primary font-bold" asChild>
                <Link href="/dashboard/transactions">View All</Link>
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentStockIns.length > 0 ? recentStockIns.map((movement) => (
                <div key={movement.id} className="p-3 rounded-xl border bg-card/50 flex items-center justify-between group hover:border-primary/30 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <ArrowUpRight className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold truncate max-w-[120px] group-hover:text-primary transition-colors">{movement.item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(movement.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-emerald-500">+{movement.quantity}</p>
                </div>
              )) : (
                <div className="p-8 border border-dashed rounded-2xl text-center">
                  <p className="text-xs text-muted-foreground">No recent stock ins</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                <Package className="size-20 rotate-12" />
             </div>
             <h3 className="text-sm font-bold text-primary mb-2">Restock Reminder</h3>
             <p className="text-xs text-muted-foreground leading-relaxed">
               {lowStockItems.length > 0 ? (
                 <>You have <span className="font-bold text-foreground">{lowStockItems.length}</span> items running low on stock. Use this page to record new shipments as they arrive.</>
               ) : (
                 <>All your items are currently above their minimum stock levels. Keep it up!</>
               )}
             </p>
             <Button variant="link" className="p-0 h-auto text-primary text-xs font-bold mt-3 gap-1" asChild>
                <Link href="/dashboard/items">
                  Check Inventory <ArrowRight className="size-3" />
                </Link>
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

