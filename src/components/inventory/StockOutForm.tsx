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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/Select';

interface StockOutFormProps {
  items: { 
    id: string; 
    name: string; 
    sku: string; 
    trackingType: string;
    units?: { id: string; serialNumber: string; locationId: string }[];
  }[];
  locations: { id: string; name: string }[];
  onSuccess?: () => void;
}

export function StockOutForm({ items, locations, onSuccess }: StockOutFormProps) {
  const [selectedItemId, setSelectedItemId] = useState<string>("");
  const [selectedLocationId, setSelectedLocationId] = useState<string>(locations[0]?.id || "");
  const [quantity, setQuantity] = useState<number>(0);
  const [selectedUnitIds, setSelectedUnitIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const selectedItem = items.find(i => i.id === selectedItemId);
  const isSerialized = selectedItem?.trackingType === 'SERIALIZED';
  
  // Available units for the selected item at the selected location
  const availableUnits = selectedItem?.units?.filter(u => u.locationId === selectedLocationId) || [];

  const toggleUnitSelection = (unitId: string) => {
    setSelectedUnitIds(prev => 
      prev.includes(unitId) ? prev.filter(id => id !== unitId) : [...prev, unitId]
    );
  };

  // Reset units when item or quantity changes
  React.useEffect(() => {
    setSelectedUnitIds([]);
  }, [selectedItemId, quantity, selectedLocationId]);

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
                  <SelectValue placeholder="Choose an item to remove..." />
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
              <MapPin className="size-3.5" /> Source Location
            </Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3.5 size-4 text-muted-foreground z-10 pointer-events-none" />
              <Select 
                name="locationId"
                required 
                onValueChange={setSelectedLocationId}
                defaultValue={selectedLocationId}
              >
                <SelectTrigger className="pl-10 h-12 rounded-2xl border bg-card/50 !transition-none">
                  <SelectValue placeholder="Source Location" />
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
              <ArrowUpFromLine className="size-3.5" /> Quantity to Remove
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
              Reference / Sale No (Optional)
            </Label>
            <Input 
              id="reason" 
              name="reason" 
              placeholder="e.g. Order #1234, Internal Usage..." 
              className="h-11 rounded-2xl bg-card/50 border-border/60 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Unit Selection (Only if Serialized) */}
        {isSerialized && quantity > 0 && (
          <div className="space-y-4 p-5 rounded-2xl border bg-amber-500/5 border-amber-500/20 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-600">
                <Info className="size-4" />
                <p className="text-xs font-bold uppercase tracking-tight">Select Individual Units ({selectedUnitIds.length}/{quantity})</p>
              </div>
              {selectedUnitIds.length > quantity && (
                <p className="text-[10px] font-bold text-destructive">Too many selected!</p>
              )}
            </div>
            
            {availableUnits.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {availableUnits.map((unit) => (
                  <button
                    key={unit.id}
                    type="button"
                    onClick={() => toggleUnitSelection(unit.id)}
                    className={cn(
                      "flex items-center justify-between p-3 rounded-xl border text-xs transition-all",
                      selectedUnitIds.includes(unit.id)
                        ? "bg-amber-500 border-amber-600 text-white shadow-sm"
                        : "bg-background border-border hover:border-amber-400"
                    )}
                  >
                    <span className="font-mono font-medium">{unit.serialNumber}</span>
                    {selectedUnitIds.includes(unit.id) && <CheckCircle2 className="size-3.5" />}
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center border border-dashed rounded-xl">
                <p className="text-xs text-muted-foreground">No available units at this location.</p>
              </div>
            )}
            <input type="hidden" name="unitIds" value={selectedUnitIds.join(',')} />
          </div>
        )}

        <div className="pt-4">
          <Button 
            type="submit" 
            disabled={loading}
            variant="default"
            className="w-full h-11 rounded-2xl font-bold gap-3 group bg-amber-600 hover:bg-amber-700 transition-all"
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
