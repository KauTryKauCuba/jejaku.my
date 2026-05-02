'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { addItem } from '@/app/actions/inventory';

interface AddItemFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddItemForm({ onSuccess, onCancel }: AddItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await addItem(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      onSuccess();
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive text-xs font-bold">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="e.g. Mechanical Keyboard" 
            required 
            className="rounded-xl h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input 
            id="sku" 
            name="sku" 
            placeholder="e.g. KB-K3-001" 
            required 
            className="rounded-xl h-10"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">Unit Price (RM)</Label>
          <Input 
            id="price" 
            name="price" 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            required 
            className="rounded-xl h-10"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="minStock">Min Stock Level</Label>
          <Input 
            id="minStock" 
            name="minStock" 
            type="number" 
            placeholder="5" 
            required 
            className="rounded-xl h-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="unit">Unit of Measure</Label>
        <Input 
          id="unit" 
          name="unit" 
          placeholder="pcs, box, kg..." 
          defaultValue="pcs"
          required 
          className="rounded-xl h-10"
        />
      </div>

      <div className="flex items-center justify-end gap-3 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel} 
          disabled={loading}
          className="rounded-xl h-10 px-6 font-normal"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="rounded-xl h-10 px-8 font-normal"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
