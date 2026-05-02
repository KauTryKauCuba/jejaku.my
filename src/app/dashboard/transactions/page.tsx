import React from 'react';

export default function TransactionsPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight">Transactions</h1>
        <p className="text-muted-foreground mt-1">
          View stock movements, sales, and restocking history.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-medium">Transaction history is coming soon...</p>
      </div>
    </div>
  );
}
