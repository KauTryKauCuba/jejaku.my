"use client"

import React, { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'

interface DashboardShellProps {
  user: {
    id: string;
    name: string;
    email: string;
    organizationName?: string | null;
  };
  children: React.ReactNode;
}

export function DashboardShell({ user, children }: DashboardShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <DashboardSidebar 
        user={user} 
        isMobileOpen={isMobileOpen} 
        setIsMobileOpen={setIsMobileOpen} 
      />
      <main className="flex-1 overflow-y-auto bg-background flex flex-col min-w-0">
        <DashboardHeader 
          user={user} 
          onMenuClick={() => setIsMobileOpen(true)} 
        />
        <div className="flex-1">
          {children}
        </div>
      </main>
    </div>
  )
}
