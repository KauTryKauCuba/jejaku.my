'use client';

// Transaction List Client Component

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  History as HistoryIcon,
  ArrowUpRight, 
  ArrowDownRight, 
  ArrowRightLeft,
  Calendar,
  User,
  MapPin,
  Package,
  MoreHorizontal
} from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Movement {
  id: string;
  type: string;
  quantity: number;
  reason: string | null;
  createdAt: Date;
  item: {
    name: string;
    sku: string;
  };
  user: {
    name: string;
  } | null;
  fromLocation: {
    name: string;
  } | null;
  toLocation: {
    name: string;
  } | null;
}

interface TransactionListClientProps {
  initialMovements: any[];
}

export function TransactionListClient({ initialMovements }: TransactionListClientProps) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string | null>(null);

  const filteredMovements = initialMovements.filter(m => {
    const matchesSearch = 
      m.item.name.toLowerCase().includes(search.toLowerCase()) ||
      m.item.sku.toLowerCase().includes(search.toLowerCase()) ||
      (m.reason?.toLowerCase().includes(search.toLowerCase()) || false);
    
    const matchesType = filterType ? m.type === filterType : true;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-3 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search by item, SKU or reason..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-card border-border/60 focus:ring-primary/20 font-normal"
            />
          </div>
          <div className="flex bg-muted/50 rounded-xl p-1 border">
            <button 
              onClick={() => setFilterType(null)}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                !filterType ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              ALL
            </button>
            <button 
              onClick={() => setFilterType('IN')}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                filterType === 'IN' ? "bg-background shadow-sm text-emerald-500" : "text-muted-foreground hover:text-foreground"
              )}
            >
              IN
            </button>
            <button 
              onClick={() => setFilterType('OUT')}
              className={cn(
                "px-3 py-1 rounded-lg text-[10px] font-bold transition-all",
                filterType === 'OUT' ? "bg-background shadow-sm text-amber-500" : "text-muted-foreground hover:text-foreground"
              )}
            >
              OUT
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="p-4 text-xs font-semibold text-muted-foreground">Type</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Product</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Quantity</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Location</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">User</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Date</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredMovements.length > 0 ? filteredMovements.map((m) => (
                <tr key={m.id} className="hover:bg-muted/30 group transition-colors">
                  <td className="p-4">
                    <div className={cn(
                      "size-8 rounded-lg flex items-center justify-center shrink-0",
                      m.type === 'IN' ? 'bg-emerald-500/10 text-emerald-500' : 
                      m.type === 'OUT' ? 'bg-amber-500/10 text-amber-500' : 'bg-primary/10 text-primary'
                    )}>
                      {m.type === 'IN' ? <ArrowUpRight className="size-4" /> : 
                       m.type === 'OUT' ? <ArrowDownRight className="size-4" /> : <ArrowRightLeft className="size-4" />}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-muted border overflow-hidden shrink-0 flex items-center justify-center">
                        {m.item.imageUrl ? (
                          <img src={m.item.imageUrl} alt={m.item.name} className="size-full object-cover" />
                        ) : (
                          <Package className="size-5 text-muted-foreground/40" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">{m.item.name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium tracking-tight">{m.item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className={cn(
                      "text-sm font-bold",
                      m.type === 'IN' ? 'text-emerald-500' : 
                      m.type === 'OUT' ? 'text-amber-500' : 'text-primary'
                    )}>
                      {m.type === 'IN' ? '+' : m.type === 'OUT' ? '-' : ''}{Math.abs(m.quantity)}
                    </p>
                    {m.reason && <p className="text-[10px] text-muted-foreground truncate max-w-[120px]">{m.reason}</p>}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <MapPin className="size-3 text-muted-foreground" />
                      {m.toLocation?.name || m.fromLocation?.name || 'Main Warehouse'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5 text-xs font-medium">
                      <User className="size-3 text-muted-foreground" />
                      {m.user?.name || 'System'}
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="space-y-0.5">
                      <p className="text-xs font-bold" suppressHydrationWarning>{new Date(m.createdAt).toLocaleDateString()}</p>
                      <p className="text-[10px] text-muted-foreground" suppressHydrationWarning>{new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </td>
                  <td className="p-4">
                    <button className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground">
                      <MoreHorizontal className="size-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <HistoryIcon className="size-8 opacity-20" />
                      <p className="text-sm font-medium">No transactions found matching your search.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
