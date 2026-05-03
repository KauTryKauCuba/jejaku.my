
// Individual Units List Client Component
'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Barcode,
  Package,
  MapPin,
  CheckCircle2,
  Clock,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

interface Unit {
  id: string;
  serialNumber: string;
  productName: string;
  sku: string;
  locationName: string;
  status: string;
  createdAt: string;
}

interface UnitListClientProps {
  initialUnits: Unit[];
  stats: {
    total: number;
    available: number;
    sold: number;
  };
}
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { MoreHorizontal, ExternalLink, Pencil, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export function UnitListClient({ initialUnits, stats }: UnitListClientProps) {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');

  const filteredUnits = initialUnits.filter(unit => 
    unit.serialNumber.toLowerCase().includes(search.toLowerCase()) ||
    unit.productName.toLowerCase().includes(search.toLowerCase()) ||
    unit.sku.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-foreground">Individual Units</h1>
          <p className="text-muted-foreground mt-1 text-sm font-normal">
            Every physical item with a unique serial number tracked in your system.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2 font-normal">
            <Download className="size-4" />
            Export Units
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4 transition-all hover:border-primary/20">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Barcode className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Units</p>
            <p className="text-lg font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4 transition-all hover:border-primary/20">
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Available</p>
            <p className="text-lg font-bold text-emerald-500">{stats.available}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4 transition-all hover:border-primary/20">
          <div className="size-10 rounded-xl bg-muted text-muted-foreground flex items-center justify-center">
            <Clock className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Sold / Out</p>
            <p className="text-lg font-bold">{stats.sold}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-3 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search Serial Number, SKU, Product..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-card border-border/60 focus:ring-primary/20 font-normal"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0">
            <Filter className="size-4" />
          </Button>
        </div>
      </div>

      {/* Unit Table */}
      <div className="rounded-2xl border bg-card overflow-hidden transition-all">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="p-4 text-xs font-semibold text-muted-foreground">Serial Number</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Product</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Location</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Date Added</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40">
              {filteredUnits.length > 0 ? filteredUnits.map((unit, i) => (
                <tr 
                  key={unit.id} 
                  className="hover:bg-muted/40 group transition-all duration-200"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                        <Barcode className="size-4" />
                      </div>
                      <span className="text-sm font-mono font-bold tracking-tight text-foreground/90">{unit.serialNumber}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{unit.productName}</span>
                      <span className="text-[10px] text-muted-foreground font-semibold tracking-wide">{unit.sku}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground">
                      <MapPin className="size-3.5 text-primary/60" />
                      {unit.locationName}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2.5 py-0.5 rounded-full border",
                      unit.status === 'AVAILABLE' 
                        ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                        : "bg-muted text-muted-foreground border-transparent"
                    )}>
                      {unit.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                      <Clock className="size-3.5 text-muted-foreground/50" />
                      {unit.createdAt}
                    </div>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background shadow-sm">
                          <MoreHorizontal className="size-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48 rounded-xl">
                        <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground px-3">Unit Actions</DropdownMenuLabel>
                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer rounded-lg mx-1">
                          <ExternalLink className="size-3.5" /> View Product Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer rounded-lg mx-1">
                          <Pencil className="size-3.5" /> Edit Serial Number
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer text-destructive focus:text-destructive rounded-lg mx-1">
                          <AlertCircle className="size-3.5" /> Mark as Damaged
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} className="p-16 text-center">
                    <div className="flex flex-col items-center gap-4 duration-500">
                      <div className="size-16 rounded-3xl bg-muted/50 flex items-center justify-center text-muted-foreground/30 border border-dashed border-border">
                        <Barcode className="size-8" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-foreground">No units matched your search</p>
                        <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Try adjusting your filters or search for another serial number.</p>
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-9 rounded-xl mt-2 font-normal"
                        onClick={() => setSearch('')}
                      >
                        Clear Search
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
