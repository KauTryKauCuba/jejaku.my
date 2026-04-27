"use client"

import React from 'react'
import { Menu, Bell } from 'lucide-react'
import { UserDropdown } from './UserDropdown'
import { ModeToggle } from '@/components/mode-toggle'

interface DashboardHeaderProps {
  user: {
    name: string;
    email: string;
  };
  onMenuClick: () => void;
}

export function DashboardHeader({ user, onMenuClick }: DashboardHeaderProps) {
  return (
    <header className="h-14 border-b flex items-center justify-between lg:justify-end px-4 lg:px-6 sticky top-0 bg-background/80 backdrop-blur-md z-10 transition-none gap-4">
      <button 
        onClick={onMenuClick}
        className="p-2 -ml-2 rounded-lg hover:bg-muted transition-colors lg:hidden"
      >
        <Menu className="size-5 text-muted-foreground" />
      </button>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="flex items-center gap-2">
          <ModeToggle />
          <button className="relative p-2 rounded-full hover:bg-muted transition-colors group border border-border/50">
            <Bell className="size-4.5 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="absolute top-1.5 right-1.5 size-2 bg-primary rounded-full border-2 border-background" />
          </button>
        </div>
        <UserDropdown user={user} />
      </div>
    </header>
  )
}
