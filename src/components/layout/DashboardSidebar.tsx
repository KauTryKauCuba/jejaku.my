'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/SiteLogo';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  LogOut, 
  Briefcase,
  ChevronLeft,
  Bell,
  Menu
} from 'lucide-react';
import { logoutUser } from '@/app/actions/auth';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/dashboard/projects', icon: Briefcase },
  { name: 'Team', href: '/dashboard/team', icon: Users },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    organizationName?: string | null;
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside 
      className={cn(
        "border-r bg-background flex flex-col h-screen sticky top-0 overflow-hidden z-20 transition-none",
        isCollapsed ? "w-16" : "w-48"
      )}
    >
      <div className="p-4 border-b flex items-center h-14 relative">
        {!isCollapsed && (
          <div className="flex-1">
            <Logo className="h-4" />
          </div>
        )}
        
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className={cn(
            "p-1.5 rounded-lg hover:bg-accent text-muted-foreground transition-none",
            isCollapsed ? "mx-auto" : "ml-auto"
          )}
        >
          {isCollapsed ? <Menu className="size-4" /> : <ChevronLeft className="size-4" />}
        </button>
      </div>

      <div className="flex-1 py-4 px-2 space-y-1 overflow-y-auto overflow-x-hidden">
        <div className="mb-2 px-1">
          {!isCollapsed && (
            <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1.5 ml-1">
              Workspace
            </p>
          )}
          <div className={cn(
            "flex items-center rounded-xl bg-muted/30 border border-border/40 overflow-hidden",
            isCollapsed ? "p-1.5 justify-center" : "p-1.5 gap-2.5"
          )}>
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-[10px] uppercase shrink-0">
              {user.organizationName?.[0] || 'J'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-none">{user.organizationName || 'My Workspace'}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-0.5">
          {!isCollapsed && (
            <p className="px-2 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1.5 mt-4 ml-1">
              Main Menu
            </p>
          )}
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center rounded-lg text-xs font-medium group overflow-hidden transition-none",
                  isCollapsed ? "p-2.5 justify-center" : "gap-2.5 px-2.5 py-1.5",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={isCollapsed ? item.name : undefined}
              >
                <Icon className={cn("size-3.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")} />
                {!isCollapsed && (
                  <span className="truncate">
                    {item.name}
                  </span>
                )}
                {!isCollapsed && isActive && <div className="ml-auto size-1 rounded-full bg-primary shrink-0" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-2 border-t space-y-1.5">
        <button className={cn(
          "flex items-center w-full rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-none group overflow-hidden",
          isCollapsed ? "p-2.5 justify-center" : "gap-2.5 px-2.5 py-1.5"
        )}>
          <Bell className="size-3.5 shrink-0 group-hover:text-accent-foreground" />
          {!isCollapsed && (
            <span>
              Notifications
            </span>
          )}
          {!isCollapsed && (
            <div className="ml-auto bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded-full font-bold">
              3
            </div>
          )}
        </button>

        <div className="pt-1">
          <div className={cn(
            "flex items-center rounded-lg bg-accent/30 border border-border/30 overflow-hidden",
            isCollapsed ? "p-1.5 justify-center" : "px-2.5 py-1.5 gap-2.5"
          )}>
            <div className="size-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-[10px] shrink-0">
              {user.name[0]}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0 text-left">
                <p className="text-[11px] font-semibold truncate leading-none mb-0.5">{user.name}</p>
                <p className="text-[9px] text-muted-foreground truncate leading-none">{user.email}</p>
              </div>
            )}
          </div>
        </div>

        <form action={async () => {
          await logoutUser();
        }} className="mt-1">
          <button 
            type="submit"
            className={cn(
              "flex items-center w-full rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-none group overflow-hidden",
              isCollapsed ? "p-2.5 justify-center" : "gap-2.5 px-2.5 py-1.5"
            )}
          >
            <LogOut className="size-3.5 shrink-0" />
            {!isCollapsed && (
              <span>
                Logout
              </span>
            )}
          </button>
        </form>
      </div>
    </aside>
  );
}
