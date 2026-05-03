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
  items: { id: string; name: string; sku: string; trackingType?: string }[];
  locations: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function StockInForm({ items, locations, onSuccess }: StockInFormProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(0);
  const [serials, setSerials] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedItem = items.find(i => i.id === selectedItemId);
  const isSerialized = selectedItem?.trackingType === 'SERIALIZED';

  const handleSerialChange = (index: number, value: string) => {
    const newSerials = [...serials];
    newSerials[index] = value;
    setSerials(newSerials);
  };

  React.useEffect(() => {
    if (isSerialized) {
      setSerials(new Array(quantity || 0).fill(""));
    }
  }, [isSerialized, quantity]);

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
            <Label htmlFor="itemId" className="text-xs font-bold text-muted-foreground flex items-center gap-2">
              <Package className="size-3.5" /> Select Product
            </Label>
            <div className="relative">
              <Package className="absolute left-3 top-3.5 size-4 text-muted-foreground z-10 pointer-events-none" />
              <Select 
                name="itemId"
                required 
                onValueChange={setSelectedItemId}
                defaultValue={selectedItemId}
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
            <Label htmlFor="locationId" className="text-xs font-bold text-muted-foreground flex items-center gap-2">
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
            <Label htmlFor="quantity" className="text-xs font-bold text-muted-foreground flex items-center gap-2">
              <ArrowDownToLine className="size-3.5" /> Quantity to Add
            </Label>
            <Input 
              id="quantity" 
              name="quantity" 
              type="number" 
              min="1"
              placeholder="0" 
              required 
              onChange={(e) => setQuantity(parseInt(e.target.value) || 0)}
              className="h-11 rounded-2xl bg-card/50 border-border/60 focus:ring-primary/20 text-lg font-bold"
            />
          </div>

          {/* Reason / Reference */}
          <div className="space-y-3">
            <Label htmlFor="reason" className="text-xs font-bold text-muted-foreground">
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

        {/* Serial Numbers (Only if Serialized) */}
        {isSerialized && quantity > 0 && (
          <div className="space-y-4 p-5 rounded-2xl border bg-primary/5 border-primary/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-center gap-2 text-primary">
              <Info className="size-4" />
              <p className="text-xs font-bold uppercase tracking-tight">Enter Serial Numbers ({quantity})</p>
            </div>
            <div className="space-y-2">
              <Label className="text-[10px] font-bold text-muted-foreground ml-1">Paste serial numbers (one per line or comma separated)</Label>
              <textarea 
                name="serialNumbers"
                placeholder="SN-001&#10;SN-002&#10;SN-003..."
                required
                rows={5}
                className="w-full rounded-xl bg-background border border-primary/20 focus:ring-1 focus:ring-primary/30 p-3 font-mono text-xs outline-none"
                onChange={(e) => {
                  const val = e.target.value;
                  const lines = val.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
                  setSerials(lines);
                }}
              />
              <p className={cn(
                "text-[10px] font-bold",
                serials.length === quantity ? "text-emerald-500" : "text-amber-500"
              )}>
                {serials.length} of {quantity} serials entered
              </p>
            </div>
          </div>
        )}

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
