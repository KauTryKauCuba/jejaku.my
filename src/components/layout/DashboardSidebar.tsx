'use client';

import React from 'react';
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
  ChevronRight,
  Bell
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

  return (
    <aside className="w-56 border-r bg-background flex flex-col h-screen sticky top-0">
      <div className="p-4 border-b flex items-center justify-center h-14">
        <Logo className="h-4" />
      </div>

      <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        <div className="mb-2 px-1">
          <p className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1.5 ml-1">
            Workspace
          </p>
          <div className="flex items-center gap-2.5 p-1.5 rounded-xl bg-muted/30 border border-border/40">
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-[10px] uppercase shrink-0">
              {user.organizationName?.[0] || 'J'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold truncate leading-none">{user.organizationName || 'My Workspace'}</p>
            </div>
          </div>
        </div>

        <nav className="space-y-0.5">
          <p className="px-2 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1.5 mt-4 ml-1">
            Main Menu
          </p>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all group",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className={cn("size-3.5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")} />
                {item.name}
                {isActive && <div className="ml-auto size-1 rounded-full bg-primary" />}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-3 border-t space-y-1.5">
        <button className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors group">
          <Bell className="size-3.5 group-hover:text-accent-foreground" />
          Notifications
          <div className="ml-auto bg-primary/10 text-primary text-[9px] px-1.5 py-0.5 rounded-full font-bold">
            3
          </div>
        </button>

        <div className="pt-1">
          <div className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg bg-accent/30 border border-border/30">
            <div className="size-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground font-bold text-[10px] shrink-0">
              {user.name[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] font-semibold truncate leading-none mb-0.5">{user.name}</p>
              <p className="text-[9px] text-muted-foreground truncate leading-none">{user.email}</p>
            </div>
          </div>
        </div>

        <form action={async () => {
          await logoutUser();
        }} className="mt-1">
          <button 
            type="submit"
            className="flex items-center gap-2.5 w-full px-2.5 py-1.5 rounded-lg text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
          >
            <LogOut className="size-3.5" />
            Logout
          </button>
        </form>
      </div>
    </aside>
  );
}
