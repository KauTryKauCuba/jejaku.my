'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { stockOut } from '@/app/actions/inventory';
import { 
  Package, 
  MapPin, 
  ArrowUpFromLine, 
  AlertCircle,
  CheckCircle2,
  ChevronRight,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface StockOutFormProps {
  items: { id: string; name: string; sku: string }[];
  locations: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function StockOutForm({ items, locations, onSuccess }: StockOutFormProps) {
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
    const result = await stockOut(formData);

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
            <p className="text-sm font-bold">Stock successfully removed!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Item Selection */}
          <div className="space-y-3">
            <Label htmlFor="itemId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <Package className="size-3.5" /> Select Product
            </Label>
            <div className="relative group">
              <select
                id="itemId"
                name="itemId"
                required
                defaultValue=""
                className="w-full h-12 px-4 rounded-2xl border bg-card/50 appearance-none focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium pr-10"
              >
                <option value="" disabled>Choose an item to remove...</option>
                {items.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sku})
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:rotate-90 transition-transform">
                <ChevronRight className="size-4" />
              </div>
            </div>
          </div>

          {/* Location Selection */}
          <div className="space-y-3">
            <Label htmlFor="locationId" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <MapPin className="size-3.5" /> Source Location
            </Label>
            <div className="relative group">
              <select
                id="locationId"
                name="locationId"
                required
                className="w-full h-12 px-4 rounded-2xl border bg-card/50 appearance-none focus:ring-2 focus:ring-primary/20 transition-all outline-none font-medium pr-10"
              >
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground group-focus-within:rotate-90 transition-transform">
                <ChevronRight className="size-4" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Quantity */}
          <div className="space-y-3">
            <Label htmlFor="quantity" className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-2">
              <ArrowUpFromLine className="size-3.5" /> Quantity to Remove
            </Label>
            <Input 
              id="quantity" 
              name="quantity" 
              type="number" 
              min="1"
              placeholder="0" 
              required 
              className="h-12 rounded-2xl bg-card/50 border-border/60 focus:ring-primary/20 text-lg font-bold"
            />
          </div>

          {/* Reason / Reference */}
          <div className="space-y-3">
            <Label htmlFor="reason" className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Reference / Sale No (Optional)
            </Label>
            <Input 
              id="reason" 
              name="reason" 
              placeholder="e.g. Order #1234, Internal Usage..." 
              className="h-12 rounded-2xl bg-card/50 border-border/60 focus:ring-primary/20"
            />
          </div>
        </div>

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            variant="default"
            className="w-full h-14 rounded-2xl font-bold text-lg shadow-xl shadow-primary/20 gap-3 group bg-amber-600 hover:bg-amber-700"
          >
            {loading ? (
              <div className="size-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <ArrowUpFromLine className="size-5 group-hover:-translate-y-0.5 transition-transform" />
                Complete Stock Out
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
