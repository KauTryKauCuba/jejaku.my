"use client"

import React, { useState } from 'react'
import { DashboardSidebar } from './DashboardSidebar'
import { DashboardHeader } from './DashboardHeader'
import { AnimatedLines } from '@/components/ui/AnimatedLines'

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
      <main className="flex-1 overflow-y-auto bg-background flex flex-col min-w-0 relative">
        <DashboardHeader 
          user={user} 
          onMenuClick={() => setIsMobileOpen(true)} 
        />
        <div className="flex-1 relative">
          <AnimatedLines />
          <div className="relative z-10">
            {children}
          </div>
        </div>
      </main>
    </div>
  )
}
