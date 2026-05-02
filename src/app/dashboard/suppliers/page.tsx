import React from 'react';

export default function SuppliersPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Suppliers</h1>
        <p className="text-muted-foreground mt-1">
          Keep track of your suppliers and vendor information.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-medium">Supplier management is coming soon...</p>
      </div>
    </div>
  );
}
