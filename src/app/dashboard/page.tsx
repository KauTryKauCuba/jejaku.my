import { redirect } from 'next/navigation';
import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
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

export default async function DashboardPage() {
  const session = await getSession();
  const userId = session?.userId;

  if (!userId) {
    redirect('/login');
  }

  const user = await db.query.users.findFirst({
    where: eq(users.id, userId),
  });

  if (!user || !user.isOnboarded) {
    redirect('/onboarding');
  }

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Overview</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back to <span className="font-semibold text-foreground">{user.organizationName}</span>'s inventory.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2">
            <History className="size-4" />
            View Logs
          </Button>
          <Button size="sm" className="h-9 gap-2">
            <Plus className="size-4" />
            Add Product
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
              <TrendingUp className="size-3" /> +2.4%
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground ">Total Products</p>
          <p className="text-[22px] font-bold mt-1">124</p>
        </div>

        <div className="group p-5 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110">
              <DollarSign className="size-5" />
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Updated just now
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground ">Stock Value</p>
          <p className="text-[22px] font-bold mt-1">RM 12,450.00</p>
        </div>

        <div className="group p-5 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-primary/10 text-primary group-hover:scale-110">
              <AlertTriangle className="size-5" />
            </div>
            <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
              Needs attention
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground ">Low Stock Items</p>
          <p className="text-[22px] font-bold mt-1">8</p>
        </div>

        <div className="group p-5 rounded-2xl border bg-card">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2 rounded-xl bg-destructive/10 text-destructive group-hover:scale-110">
              <Package className="size-5" />
            </div>
            <span className="text-xs font-bold text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
              Critical
            </span>
          </div>
          <p className="text-xs font-medium text-muted-foreground ">Out of Stock</p>
          <p className="text-[22px] font-bold mt-1">3</p>
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
            <Button variant="ghost" size="sm" className="text-xs font-medium h-8 gap-1 hover:bg-primary/5 hover:text-primary">
              See all activity <ArrowRight className="size-3" />
            </Button>
          </div>

          <div className="rounded-2xl border bg-card overflow-hidden">
            <div className="divide-y border-t-0">
              {[
                { name: 'Mechanical Keyboard K3', type: 'Restock', qty: '+50', time: '2 hours ago', status: 'increase' },
                { name: 'USB-C Charging Cable', type: 'Sale', qty: '-12', time: '5 hours ago', status: 'decrease' },
                { name: 'Wireless Mouse Pro', type: 'Adjustment', qty: '-2', time: '1 day ago', status: 'decrease' },
                { name: 'Monitor Stand Alpha', type: 'Restock', qty: '+10', time: '2 days ago', status: 'increase' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 hover:bg-muted/30 group">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full shrink-0 ${
                      activity.status === 'increase' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-primary/10 text-primary'
                    }`}>
                      {activity.status === 'increase' ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
                    </div>
                    <div>
                      <p className="text-sm font-semibold group-hover:text-primary">{activity.name}</p>
                      <p className="text-xs text-muted-foreground font-medium ">{activity.type} • {activity.time}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`text-sm font-bold ${
                      activity.status === 'increase' ? 'text-emerald-500' : 'text-primary'
                    }`}>
                      {activity.qty}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions & Tips */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold">Quick Actions</h2>
            <div className="grid grid-cols-1 gap-3">
              <Button variant="outline" className="justify-start h-auto py-3 px-4 rounded-xl hover:border-primary/50 hover:bg-primary/5 group">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-bold group-hover:text-primary">Stock Adjustment</span>
                  <span className="text-xs text-muted-foreground font-normal">Manually update stock levels</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4 rounded-xl hover:border-primary/50 hover:bg-primary/5 group">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-bold group-hover:text-primary">Generate Report</span>
                  <span className="text-xs text-muted-foreground font-normal">Download monthly inventory stats</span>
                </div>
              </Button>
              <Button variant="outline" className="justify-start h-auto py-3 px-4 rounded-xl hover:border-primary/50 hover:bg-primary/5 group">
                <div className="flex flex-col items-start gap-1">
                  <span className="text-sm font-bold group-hover:text-primary">Manage Suppliers</span>
                  <span className="text-xs text-muted-foreground font-normal">View and edit supplier list</span>
                </div>
              </Button>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-primary/5 border border-primary/20 relative overflow-hidden group">
             <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20">
                <TrendingUp className="size-20 rotate-12" />
             </div>
             <h3 className="text-sm font-bold text-primary mb-2">Inventory Insight</h3>
             <p className="text-xs text-muted-foreground leading-relaxed">
               Your sales for <span className="font-bold text-foreground">Mechanical Keyboard K3</span> are up by 15% this week. Consider restocking soon to avoid stockouts.
             </p>
             <Button variant="link" className="p-0 h-auto text-primary text-xs font-bold mt-3 gap-1">
               Review Analytics <ArrowRight className="size-3" />
             </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

