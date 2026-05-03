
'use client';

import React, { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRight } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { StockInForm } from '@/components/inventory/StockInForm';
import { StockOutForm } from '@/components/inventory/StockOutForm';

interface DashboardQuickActionsProps {
  items: any[];
  locations: any[];
}

export function DashboardQuickActions({ items, locations }: DashboardQuickActionsProps) {
  const [isStockInOpen, setIsStockInOpen] = useState(false);
  const [isStockOutOpen, setIsStockOutOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Stock In Card */}
        <button 
          onClick={() => setIsStockInOpen(true)}
          className="group p-5 rounded-2xl border bg-card hover:border-emerald-500/50 hover:bg-emerald-500/5 transition-all flex items-center justify-between text-left w-full"
        >
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowUpRight className="size-6 rotate-45" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground group-hover:text-emerald-600 transition-colors">Stock In</p>
              <p className="text-[12px] text-muted-foreground font-medium">Add inventory</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground group-hover:text-emerald-500 group-hover:translate-x-1 transition-all" />
        </button>

        {/* Stock Out Card */}
        <button 
          onClick={() => setIsStockOutOpen(true)}
          className="group p-5 rounded-2xl border bg-card hover:border-amber-500/50 hover:bg-amber-500/5 transition-all flex items-center justify-between text-left w-full"
        >
          <div className="flex items-center gap-4">
            <div className="size-12 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
              <ArrowDownRight className="size-6 rotate-45" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground group-hover:text-amber-600 transition-colors">Stock Out</p>
              <p className="text-[12px] text-muted-foreground font-medium">Record removals</p>
            </div>
          </div>
          <ArrowRight className="size-4 text-muted-foreground group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
        </button>
      </div>

      {/* Stock In Modal */}
      <Modal
        isOpen={isStockInOpen}
        onClose={() => setIsStockInOpen(false)}
        title="Stock In"
      >
        <StockInForm 
          items={items} 
          locations={locations} 
          onSuccess={() => setIsStockInOpen(false)} 
        />
      </Modal>

      {/* Stock Out Modal */}
      <Modal
        isOpen={isStockOutOpen}
        onClose={() => setIsStockOutOpen(false)}
        title="Stock Out"
      >
        <StockOutForm 
          items={items} 
          locations={locations} 
          onSuccess={() => setIsStockOutOpen(false)} 
        />
      </Modal>
    </>
  );
}
