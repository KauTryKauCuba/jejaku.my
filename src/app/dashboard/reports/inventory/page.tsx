import React from 'react';

export default function Page() {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      <div>
        <h1 className="text-[22px] font-bold tracking-tight">Inventory Report</h1>
        <p className="text-muted-foreground mt-1">Detailed inventory analysis.</p>
      </div>
      
      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-medium">Inventory Report module is coming soon...</p>
      </div>
    </div>
  );
}
