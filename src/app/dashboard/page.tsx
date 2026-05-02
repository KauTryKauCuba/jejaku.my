import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users, organizations, items, stockLevels, stockMovements } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { getSession } from '@/lib/session';
import { 
  Package, 
  TrendingUp, 
  AlertTriangle, 
  DollarSign, 
  Plus, 
  ArrowRight,
  History,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    redirect('/login');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  const organization = user?.organizationId 
    ? await db.query.organizations.findFirst({
        where: eq(organizations.id, user.organizationId)
      })
    : null;

  if (!user || !user.isOnboarded) {
    redirect('/onboarding');
  }

  const orgId = user.organizationId!;

  // 1. Fetch all items and their stock levels for stats
  const dbItems = await db.query.items.findMany({
    where: eq(items.organizationId, orgId),
    with: {
      stockLevels: true,
    }
  });

  // 2. Fetch recent movements
  const recentMovements = await db.query.stockMovements.findMany({
    where: eq(stockMovements.organizationId, orgId),
    with: {
      item: true,
    },
    limit: 4,
    orderBy: [desc(stockMovements.createdAt)],
  });

  // 3. Calculate Stats
  const totalProducts = dbItems.length;
  
  let totalStockValue = 0;
  let lowStockCount = 0;
  let outOfStockCount = 0;

  dbItems.forEach(item => {
    const totalQty = item.stockLevels.reduce((sum, sl) => sum + sl.quantity, 0);
    const price = parseFloat(item.price || '0');
    
    totalStockValue += totalQty * price;

    if (totalQty === 0) {
      outOfStockCount++;
    } else if (totalQty <= item.minStock) {
      lowStockCount++;
    }
  });

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1 text-sm font-normal">
            Welcome back to <span className="font-semibold text-foreground">{organization?.name || 'your'}</span> inventory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2 font-normal" asChild>
            <Link href="/dashboard/transactions">
              <History className="size-4" />
              View Logs
            </Link>
          </Button>
          <Button size="sm" className="h-9 gap-2 font-normal" asChild>
            <Link href="/dashboard/items">
              <Plus className="size-4" />
              Add Product
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="group p-5 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110">
              <Package className="size-5" />
            </div>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="size-3" /> Live
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground ">Total Products</p>
          <p className="text-[22px] font-bold mt-1">{totalProducts}</p>
        </div>

        <div className="group p-5 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110">
              <DollarSign className="size-5" />
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Stock Value
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground ">Total Value</p>
          <p className="text-[22px] font-bold mt-1">RM {totalStockValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
        </div>

        <div className="group p-5 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110">
              <AlertTriangle className="size-5" />
            </div>
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              lowStockCount > 0 ? "text-amber-500 bg-amber-500/10" : "text-primary bg-primary/10"
            )}>
              {lowStockCount > 0 ? 'Action required' : 'All good'}
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground ">Low Stock Items</p>
          <p className="text-[22px] font-bold mt-1">{lowStockCount}</p>
        </div>

        <div className="group p-5 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-destructive/10 text-destructive group-hover:scale-110">
              <Package className="size-5" />
            </div>
            <span className={cn(
              "text-xs font-bold px-2 py-0.5 rounded-full",
              outOfStockCount > 0 ? "bg-destructive/10 text-destructive" : "bg-primary/10 text-primary"
            )}>
              {outOfStockCount > 0 ? 'Critical' : 'Healthy'}
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground ">Out of Stock</p>
          <p className="text-[22px] font-bold mt-1">{outOfStockCount}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <History className="size-4 text-primary" />
              Recent Stock Activity
            </h2>
            <Button variant="ghost" size="sm" className="text-xs font-medium h-8 gap-1 hover:bg-primary/5 hover:text-primary" asChild>
              <Link href="/dashboard/transactions">
                See all activity <ArrowRight className="size-3" />
              </Link>
            </Button>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="divide-y border-t-0">
              {recentMovements.length > 0 ? recentMovements.map((movement, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full shrink-0 ${
                      (movement.type === 'IN' || movement.quantity > 0) ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'
                    }`}>
                      {(movement.type === 'IN' || movement.quantity > 0) ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-primary">{movement.item.name}</p>
                      <p className="text-xs text-muted-foreground font-medium ">{movement.type} • {new Date(movement.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      (movement.type === 'IN' || movement.quantity > 0) ? 'text-emerald-500' : 'text-primary'
                    }`}>
                      {movement.quantity > 0 ? `+${movement.quantity}` : movement.quantity}
                    </p>
                  </div>
                </div>
              )) : (
                <div className="p-12 text-center">
                  <p className="text-sm text-muted-foreground">No recent activity found.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3 px-4 rounded-xl hover:border-primary/50 hover:bg-primary/5 group" asChild>
                <Link href="/dashboard/adjust">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-bold group-hover:text-primary">Stock Adjustment</span>
                    <span className="text-xs text-muted-foreground font-normal">Manually update stock levels</span>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4 rounded-xl hover:border-primary/50 hover:bg-primary/5 group" asChild>
                <Link href="/dashboard/reports/summary">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-bold group-hover:text-primary">Generate Report</span>
                    <span className="text-xs text-muted-foreground font-normal">Download monthly inventory stats</span>
                  </div>
                </Link>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4 rounded-xl hover:border-primary/50 hover:bg-primary/5 group" asChild>
                <Link href="/dashboard/data/partners">
                  <div className="flex flex-col items-start gap-1">
                    <span className="text-sm font-bold group-hover:text-primary">Manage Suppliers</span>
                    <span className="text-xs text-muted-foreground font-normal">View and edit supplier list</span>
                  </div>
                </Link>
              </Button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                <TrendingUp className="size-20 rotate-12" />
             </div>
             <h3 className="text-sm font-bold text-primary mb-2">Inventory Insight</h3>
             <p className="text-xs text-muted-foreground leading-relaxed">
               {dbItems.length > 0 ? (
                 <>You have <span className="font-bold text-foreground">{totalProducts}</span> products across your locations. {lowStockCount > 0 ? `Consider restocking the ${lowStockCount} items that are running low.` : 'Your stock levels look healthy!'}</>
               ) : (
                 <>Welcome! Start by adding your first product to see inventory insights and trends here.</>
               )}
             </p>
             <Button variant="link" className="p-0 h-auto text-primary text-xs font-bold mt-3 gap-1" asChild>
                <Link href="/dashboard/reports/dashboard">
                  Review Analytics <ArrowRight className="size-3" />
                </Link>
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
