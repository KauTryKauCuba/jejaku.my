'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { stockIn } from '@/app/actions/inventory';
import { 
  Package, 
  MapPin, 
  ArrowDownToLine, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/Select';

interface StockInFormProps {
  items: { id: string; name: string; sku: string }[];
  locations: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function StockInForm({ items, locations, onSuccess }: StockInFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData(form);
    const result = await stockIn(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      form.reset();
      if (onSuccess) {
        setTimeout(onSuccess, 1500);
      }
    }
  }

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-2xl bg-destructive/10 border border-destructive/20 flex items-center gap-3 text-destructive animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm font-bold">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-500 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="size-5 shrink-0" />
            <p className="text-sm font-bold">Stock successfully added!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Selection */}
          <div className="space-y-3">
            <Label htmlFor="itemId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Package className="size-3.5" /> Select Product
            </Label>
            <div className="relative">
              <Package className="absolute left-3 top-3.5 size-4 text-muted-foreground z-10 pointer-events-none" />
              <Select 
                name="itemId"
                required 
                defaultValue=""
              >
                <SelectTrigger className="pl-10 h-12 rounded-2xl border bg-card/50 !transition-none">
                  <SelectValue placeholder="Choose an item..." />
                </SelectTrigger>
                <SelectContent>
                  {items.map((item) => (
                    <SelectItem key={item.id} value={item.id}>
                      {item.name} ({item.sku})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Location Selection */}
          <div className="space-y-3">
            <Label htmlFor="locationId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MapPin className="size-3.5" /> Warehouse Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 size-4 text-muted-foreground z-10 pointer-events-none" />
              <Select 
                name="locationId"
                required 
                defaultValue={locations[0]?.id || ""}
              >
                <SelectTrigger className="pl-10 h-12 rounded-2xl border bg-card/50 !transition-none">
                  <SelectValue placeholder="Warehouse Location" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((loc) => (
                    <SelectItem key={loc.id} value={loc.id}>
                      {loc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quantity */}
          <div className="space-y-3">
            <Label htmlFor="quantity" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ArrowDownToLine className="size-3.5" /> Quantity to Add
            </Label>
            <Input 
              id="quantity" 
              name="quantity" 
              type="number" 
              min="1"
              placeholder="0" 
              required 
              className="h-11 rounded-2xl bg-card/50 border-border/60 focus:ring-primary/20 text-lg font-bold"
            />
          </div>

          {/* Reason / Reference */}
          <div className="space-y-3">
            <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Reference / Reason (Optional)
            </Label>
            <Input 
              id="reason" 
              name="reason" 
              placeholder="e.g. New Shipment, Purchase Order..." 
              className="h-11 rounded-2xl bg-card/50 border-border/60 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            className="w-full h-11 rounded-2xl font-bold gap-3 group transition-all"
          >
            {loading ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ArrowDownToLine className="size-5 group-hover:translate-y-0.5 transition-transform" />
                Complete Stock In
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
