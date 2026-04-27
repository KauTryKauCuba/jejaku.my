import React from 'react';

export default function TeamPage() {
  return (
    <div className="p-6 lg:p-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Team</h1>
        <p className="text-muted-foreground mt-1">
          Manage team members and their access permissions.
        </p>
      </div>

      <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 h-[400px] flex items-center justify-center">
        <p className="text-muted-foreground text-sm font-medium">Team management is coming soon...</p>
      </div>
    </div>
  );
}
