import React from 'react';
import { db } from '@/db';
import { items, locations, stockMovements, users } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { redirect } from 'next/navigation';
import { StockOutForm } from '@/components/inventory/StockOutForm';
import { 
  ArrowLeft, 
  ArrowUpFromLine, 
  History as HistoryIcon, 
  Package, 
  AlertTriangle,
  ArrowDownRight,
  TrendingDown,
  ArrowRight,
  Plus,
  ShoppingCart
} from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

export default async function StockOutPage() {
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
      units: {
        where: (units, { eq }) => eq(units.status, 'AVAILABLE'),
      },
    },
    orderBy: (items, { asc }) => [asc(items.name)],
  });

  // Fetch locations
  const dbLocations = await db.query.locations.findMany({
    where: eq(locations.organizationId, user.organizationId),
  });

  // Fetch recent stock out movements
  const recentStockOuts = await db.query.stockMovements.findMany({
    where: and(
      eq(stockMovements.organizationId, user.organizationId),
      eq(stockMovements.type, 'OUT')
    ),
    with: {
      item: true,
    },
    limit: 5,
    orderBy: [desc(stockMovements.createdAt)],
  });

  // Calculate stats
  const outOfStockItems = dbItems.filter(item => {
    const totalStock = item.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0);
    return totalStock === 0;
  });

  const lowStockItems = dbItems.filter(item => {
    const totalStock = item.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0);
    return totalStock > 0 && totalStock <= item.minStock;
  });

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Stock Out</h1>
          <p className="text-muted-foreground mt-1 text-sm font-normal">
            Record outgoing stock for sales, usage or damage.
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
          <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <ArrowUpFromLine className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Recent Out</p>
            <p className="text-lg font-bold">{recentStockOuts.length}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card flex items-center gap-4">
          <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Out of Stock</p>
            <p className="text-lg font-bold text-destructive">{outOfStockItems.length}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card flex items-center gap-4">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <ShoppingCart className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Available</p>
            <p className="text-lg font-bold text-primary">{dbItems.length - outOfStockItems.length}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="p-6 border-b bg-muted/20">
              <h2 className="text-sm font-bold flex items-center gap-2 text-amber-600">
                <ShoppingCart className="size-4" />
                Record Stock Removal
              </h2>
            </div>
            <div className="p-6">
              <StockOutForm items={dbItems} locations={dbLocations} />
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <HistoryIcon className="size-4 text-primary" />
                Recent Shipments
              </h3>
              <Button variant="link" className="p-0 h-auto text-xs text-primary font-bold" asChild>
                <Link href="/dashboard/transactions">View All</Link>
              </Button>
            </div>
            
            <div className="space-y-3">
              {recentStockOuts.length > 0 ? recentStockOuts.map((movement) => (
                <div key={movement.id} className="p-3 rounded-xl border bg-card/50 flex items-center justify-between group hover:border-amber-300 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center">
                      <ArrowDownRight className="size-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold truncate max-w-[120px] group-hover:text-amber-600 transition-colors">{movement.item.name}</p>
                      <p className="text-[10px] text-muted-foreground">{new Date(movement.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="text-xs font-bold text-amber-600">{movement.quantity}</p>
                </div>
              )) : (
                <div className="p-8 border border-dashed rounded-2xl text-center">
                  <p className="text-xs text-muted-foreground">No recent stock outs</p>
                </div>
              )}
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-amber-500/5 border border-amber-500/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                <AlertTriangle className="size-20 rotate-12 text-amber-500" />
             </div>
             <h3 className="text-sm font-bold text-amber-600 mb-2">Safety Check</h3>
             <p className="text-xs text-muted-foreground leading-relaxed">
               {outOfStockItems.length > 0 ? (
                 <>You have <span className="font-bold text-destructive">{outOfStockItems.length}</span> items completely out of stock. Stock out is only permitted for items with positive inventory.</>
               ) : (
                 <>All items have positive inventory. Ensure you record every sale to keep your stock levels synchronized.</>
               )}
             </p>
             <Button variant="link" className="p-0 h-auto text-amber-600 text-xs font-bold mt-3 gap-1" asChild>
                <Link href="/dashboard/reports/summary">
                  Inventory Report <ArrowRight className="size-3" />
                </Link>
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
