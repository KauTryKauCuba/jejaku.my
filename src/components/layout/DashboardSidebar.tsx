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
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  ArrowDownLeft,
  ArrowUpRight,
  Settings2,
  Move,
  History,
  ShoppingCart,
  Barcode,
  Zap,
  BarChart3,
  Database,
  UserPlus,
  Bell,
  CreditCard,
  Layers,
  MapPin,
  Tag,
  Handshake,
  DollarSign,
  X,
  Menu
} from 'lucide-react';

interface NavItem {
  name: string;
  href?: string;
  icon?: any;
  items?: { name: string; href: string; icon?: any }[];
}

const navItems: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Item List', href: '/dashboard/items', icon: List },
  { name: 'Stock In', href: '/dashboard/stock-in', icon: ArrowDownLeft },
  { name: 'Stock Out', href: '/dashboard/stock-out', icon: ArrowUpRight },
  { name: 'Adjust Stock', href: '/dashboard/adjust', icon: Settings2 },
  { name: 'Move Stock', href: '/dashboard/move', icon: Move },
  { name: 'Transaction', href: '/dashboard/transactions', icon: History },
  { 
    name: 'Purchase & Sales', 
    icon: ShoppingCart,
    items: [
      { name: 'Purchases', href: '/dashboard/purchases' },
      { name: 'Sales', href: '/dashboard/sales' },
      { name: 'Returns', href: '/dashboard/returns' },
    ]
  },
  { 
    name: 'Barcode Labels', 
    icon: Barcode,
    items: [
      { name: 'Print Items', href: '/dashboard/barcode/items' },
      { name: 'Print Bundles', href: '/dashboard/barcode/bundles' },
    ]
  },
  { 
    name: 'Other Features', 
    icon: Zap,
    items: [
      { name: 'Low Stock Alerts', href: '/dashboard/alerts' },
      { name: 'Inventory Link', href: '/dashboard/inventory-link' },
      { name: 'Inventory Count', href: '/dashboard/inventory-count' },
    ]
  },
  { 
    name: 'Reports', 
    icon: BarChart3,
    items: [
      { name: 'Summary', href: '/dashboard/reports/summary' },
      { name: 'Past Quantity', href: '/dashboard/reports/past-quantity' },
      { name: 'Dashboard', href: '/dashboard/reports/dashboard' },
      { name: 'Inventory', href: '/dashboard/reports/inventory' },
      { name: 'Sales', href: '/dashboard/reports/sales' },
    ]
  },
  { 
    name: 'Data Center', 
    icon: Database,
    items: [
      { name: 'Items', href: '/dashboard/data/items' },
      { name: 'Bundles', href: '/dashboard/data/bundles' },
      { name: 'Locations', href: '/dashboard/data/locations' },
      { name: 'Attributes', href: '/dashboard/data/attributes' },
      { name: 'Partners', href: '/dashboard/data/partners' },
      { name: 'Price Lists', href: '/dashboard/data/price-lists' },
    ]
  },
  { 
    name: 'Settings', 
    icon: Settings,
    items: [
      { name: 'Team', href: '/dashboard/settings/team' },
      { name: 'Members', href: '/dashboard/settings/members' },
      { name: 'Notifications', href: '/dashboard/settings/notifications' },
      { name: 'Orders', href: '/dashboard/settings/orders' },
      { name: 'Integrations', href: '/dashboard/settings/integrations' },
      { name: 'Billing', href: '/dashboard/settings/billing' },
    ]
  },
];

interface DashboardSidebarProps {
  user: {
    name: string;
    email: string;
    organizationName?: string | null;
  };
  isMobileOpen?: boolean;
  setIsMobileOpen?: (open: boolean) => void;
}

export function DashboardSidebar({ user, isMobileOpen, setIsMobileOpen }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);

  const toggleExpand = (name: string) => {
    setExpandedItems(prev => 
      prev.includes(name) ? prev.filter(i => i !== name) : [...prev, name]
    );
  };

  const NavLink = ({ item, isSubItem = false }: { item: any, isSubItem?: boolean }) => {
    const isActive = pathname === item.href;
    const Icon = item.icon;
    const hasSubItems = item.items && item.items.length > 0;
    const isExpanded = expandedItems.includes(item.name);

    if (hasSubItems && !isCollapsed) {
      return (
        <div className="space-y-1">
          <button
            onClick={() => toggleExpand(item.name)}
            className={cn(
              "w-full flex items-center rounded-lg text-xs font-medium group transition-none px-3 py-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              isExpanded && "bg-accent/50"
            )}
          >
            {Icon && <Icon className="size-3.5 shrink-0 mr-3" />}
            <span className="truncate flex-1 text-left">{item.name}</span>
            {isExpanded ? <ChevronDown className="size-3" /> : <ChevronRight className="size-3" />}
          </button>
          {isExpanded && (
            <div className="ml-4 pl-3 border-l space-y-1">
              {item.items.map((subItem: any) => (
                <NavLink key={subItem.name} item={subItem} isSubItem />
              ))}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        href={item.href || '#'}
        className={cn(
          "flex items-center rounded-lg text-xs font-medium group transition-none px-3 py-2",
          isCollapsed ? "justify-center px-0" : "gap-3",
          isActive 
            ? "bg-primary/10 text-primary" 
            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
          isSubItem && "py-1.5"
        )}
        title={isCollapsed ? item.name : ""}
        onClick={() => isMobileOpen && setIsMobileOpen?.(false)}
      >
        {Icon && <Icon className={cn("size-3.5 shrink-0", isActive ? "text-primary" : "text-muted-foreground group-hover:text-accent-foreground")} />}
        {!isCollapsed && <span className="truncate">{item.name}</span>}
        {!isCollapsed && isActive && <div className="ml-auto size-1 rounded-full bg-primary shrink-0" />}
      </Link>
    );
  };

  return (
    <>
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-30 lg:hidden"
          onClick={() => setIsMobileOpen?.(false)}
        />
      )}

      <aside 
        className={cn(
          "border-r bg-background flex-col h-screen sticky top-0 overflow-hidden z-40 lg:flex",
          isCollapsed ? "w-16" : "w-64",
          isMobileOpen ? "fixed inset-y-0 left-0 flex w-64 shadow-2xl" : "hidden lg:flex"
        )}
      >
        <div className="p-4 border-b flex items-center h-14 relative justify-between">
          <Link href="/" className={cn("flex-1", (isCollapsed && !isMobileOpen) && "hidden")}>
            <Logo />
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

        <div className="flex-1 py-4 px-3 space-y-6 overflow-y-auto overflow-x-hidden custom-scrollbar">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink key={item.name} item={item} />
            ))}
          </div>
        </div>

        <div className="p-4 border-t">
          <div className={cn(
            "flex items-center rounded-xl bg-muted/30 border border-border/40 overflow-hidden p-2 gap-3",
            isCollapsed && "justify-center px-0 bg-transparent border-none"
          )}>
            <div className="size-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs shrink-0">
              {user.organizationName?.[0] || 'J'}
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate leading-none mb-1">{user.organizationName || 'My Company'}</p>
                <p className="text-[10px] text-muted-foreground truncate">{user.email}</p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
