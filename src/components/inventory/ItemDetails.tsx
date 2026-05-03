'use client';

import React from 'react';
import { 
  Package, 
  Tag, 
  BarChart3, 
  History, 
  MapPin,
  AlertCircle,
  Calendar,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface Item {
  id: string;
  name: string;
  sku: string;
  category: string;
  stock: number;
  minStock: number;
  price: string;
  status: string;
  unit: string;
  imageUrl: string | null;
  qrCode: string | null;
  trackingType: string;
  units?: {
    id: string;
    serialNumber: string;
    status: string;
    location: string;
  }[];
}

interface ItemDetailsProps {
  item: Item;
  onClose: () => void;
}

export function ItemDetails({ item, onClose }: ItemDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Top Banner Info */}
      <div className="flex items-start gap-4 p-4 rounded-2xl bg-muted/30 border border-border/50">
        <div className="size-16 rounded-2xl bg-muted border text-muted-foreground flex items-center justify-center shrink-0 overflow-hidden">
          {item.imageUrl ? (
            <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
          ) : (
            <Package className="size-8 text-muted-foreground/40" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-bold truncate">{item.name}</h3>
            <span className={cn(
              "text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap",
              item.status === 'In Stock' && "bg-emerald-500/10 text-emerald-500",
              item.status === 'Low Stock' && "bg-amber-500/10 text-amber-500",
              item.status === 'Out of Stock' && "bg-destructive/10 text-destructive",
            )}>
              {item.status}
            </span>
          </div>
          <p className="text-xs text-muted-foreground font-medium mt-0.5">{item.sku}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-background border text-muted-foreground">
              {item.category}
            </span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border bg-card/50 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <BarChart3 className="size-4" />
            <span className="text-xs font-medium">Current Stock</span>
          </div>
          <p className="text-xl font-bold">{item.stock} <span className="text-sm font-normal text-muted-foreground">{item.unit}</span></p>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="size-4" />
            <span className="text-xs font-medium">Unit Price</span>
          </div>
          <p className="text-xl font-bold">{item.price}</p>
        </div>
      </div>

      {/* Inventory Health */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-muted-foreground px-1">Stock Health</h4>
        <div className="p-4 rounded-2xl border bg-card/50 space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Availability</span>
              <span className="text-sm font-bold">{Math.round((item.stock / (item.minStock * 2 || 10)) * 100)}%</span>
            </div>
            <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full rounded-full transition-all duration-1000",
                  item.stock === 0 ? "bg-destructive w-full" : 
                  item.stock <= item.minStock ? "bg-amber-500 w-1/3" : "bg-emerald-500 w-3/4"
                )}
              />
            </div>
          </div>
          <div className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 border border-border/40">
            <AlertCircle className="size-4 text-amber-500 mt-0.5" />
            <div className="space-y-0.5">
              <p className="text-[11px] font-bold">Minimum Threshold</p>
              <p className="text-[11px] text-muted-foreground">Alerts will trigger when stock falls below {item.minStock} {item.unit}.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Placeholder (Quick Info) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between px-1">
          <h4 className="text-xs font-bold text-muted-foreground">Quick Details</h4>
          <Button variant="ghost" size="sm" className="h-6 text-[10px] font-bold">View History</Button>
        </div>
        <div className="divide-y border rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-3 bg-card/50">
            <div className="flex items-center gap-2 text-xs">
              <MapPin className="size-3.5 text-muted-foreground" />
              <span>Primary Location</span>
            </div>
            <span className="text-xs font-bold">Main Warehouse</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-card/50">
            <div className="flex items-center gap-2 text-xs">
              <Calendar className="size-3.5 text-muted-foreground" />
              <span>Last Restocked</span>
            </div>
            <span className="text-xs font-bold">2 days ago</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-card/50">
            <div className="flex items-center gap-2 text-xs">
              <Clock className="size-3.5 text-muted-foreground" />
              <span>Lead Time</span>
            </div>
            <span className="text-xs font-bold">3-5 Days</span>
          </div>
        </div>
      </div>
      
      {/* Serialized Units List */}
      {item.trackingType === 'SERIALIZED' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Individual Units ({item.units?.length})</h4>
            <span className="text-[10px] font-bold text-emerald-500">Available: {item.units?.filter(u => u.status === 'AVAILABLE').length}</span>
          </div>
          <div className="border rounded-2xl overflow-hidden bg-muted/20 divide-y max-h-60 overflow-y-auto custom-scrollbar">
            {item.units && item.units.length > 0 ? (
              item.units.map((unit) => (
                <div key={unit.id} className="p-3 flex items-center justify-between group hover:bg-background transition-colors">
                  <div className="flex flex-col">
                    <span className="text-xs font-mono font-bold">{unit.serialNumber}</span>
                    <div className="flex items-center gap-2 mt-0.5">
                      <MapPin className="size-3 text-muted-foreground" />
                      <span className="text-[10px] text-muted-foreground">{unit.location}</span>
                    </div>
                  </div>
                  <span className={cn(
                    "text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase tracking-tight",
                    unit.status === 'AVAILABLE' ? "bg-emerald-500/10 text-emerald-500" : "bg-muted text-muted-foreground"
                  )}>
                    {unit.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-8 text-center">
                <p className="text-xs text-muted-foreground font-medium">No units registered yet.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* QR Code Section */}
      {item.qrCode && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-muted-foreground px-1 uppercase tracking-wider">Product QR Label</h4>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border/40 shadow-sm">
            <div className="size-20 bg-white p-1 border rounded-lg shrink-0">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${item.qrCode}`} 
                alt="Product QR Code"
                className="size-full"
              />
            </div>
            <div className="space-y-1">
              <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Unique ID</p>
              <p className="text-sm font-mono font-bold text-primary">{item.qrCode}</p>
              <p className="text-[10px] text-muted-foreground font-medium">Scan this code for quick stock-in and stock-out actions.</p>
            </div>
          </div>
        </div>
      )}

      <div className="pt-2">
        <Button onClick={onClose} className="w-full h-11 rounded-xl font-bold transition-all">
          Close Details
        </Button>
      </div>
    </div>
  );
}
