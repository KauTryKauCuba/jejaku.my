'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/ui/SiteLogo';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  Settings, 
  Truck,
  ArrowLeftRight,
  ChevronLeft,
  Bell,
  Menu,
  X
} from 'lucide-react';

import { logoutUser } from '@/app/actions/auth';

const navItems = [
  { name: 'Overview', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
  { name: 'Suppliers', href: '/dashboard/suppliers', icon: Truck },
  { name: 'Transactions', href: '/dashboard/transactions', icon: ArrowLeftRight },
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

export function DashboardSidebar({ user, isMobileOpen, setIsMobileOpen }: DashboardSidebarProps & { isMobileOpen?: boolean, setIsMobileOpen?: (open: boolean) => void }) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      <aside 
        className={cn(
          "border-r bg-background flex-col h-screen sticky top-0 overflow-hidden z-40 lg:flex",
          isCollapsed ? "w-16" : "w-60",
          isMobileOpen ? "fixed inset-y-0 left-0 flex w-60 shadow-2xl" : "hidden lg:flex"
        )}
      >
        <div className="p-4 border-b flex items-center h-14 relative justify-between">
          <Link href="/" className={cn("flex-1", (isCollapsed && !isMobileOpen) && "hidden")}>
            <Logo className="h-4" />
          </Link>
          <button 
            onClick={() => isMobileOpen ? setIsMobileOpen?.(false) : setIsCollapsed(!isCollapsed)}
            className={cn(
              "p-1.5 rounded-lg hover:bg-muted text-muted-foreground",
              (isCollapsed && !isMobileOpen) && "mx-auto"
            )}
          >
            {isMobileOpen ? <X className="size-4" /> : (isCollapsed ? <Menu className="size-4" /> : <ChevronLeft className="size-4" />)}
          </button>
        </div>

      <div className="flex-1 py-6 px-3 space-y-2 overflow-y-auto overflow-x-hidden">
        <div className="mb-3 px-1">
          {!isCollapsed && (
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 mb-1.5 ml-1">
              Company
            </p>
          )}
          <div className={cn(
            "flex items-center rounded-xl bg-muted/30 border border-border/40 overflow-hidden p-2 gap-3",
            isCollapsed && "justify-center px-0 bg-transparent border-none"
          )}>
            <div className="size-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs uppercase shrink-0">
              {user.organizationName?.[0] || 'J'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold truncate leading-none">{user.organizationName || 'My Company'}</p>
              </div>
            )}
          </div>
        </div>

        <nav className="space-y-1">
          {!isCollapsed && (
            <p className="px-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground/70 mb-2 mt-6 ml-1">
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
                  "flex items-center rounded-lg text-xs font-medium group overflow-hidden transition-none px-3 py-2",
                  isCollapsed ? "justify-center px-0" : "gap-3",
                  isActive 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                title={isCollapsed ? item.name : ""}
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
    </aside>
    </>
  );
}
