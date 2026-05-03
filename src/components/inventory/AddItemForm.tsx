'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { addItem } from '@/app/actions/inventory';
import { Camera, Upload, X, Package } from 'lucide-react';

interface AddItemFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddItemForm({ onSuccess, onCancel }: AddItemFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  // Auto-generate SKU based on name
  const [sku, setSku] = useState('');
  const [skuEdited, setSkuEdited] = useState(false);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    if (!skuEdited) {
      if (!name.trim()) {
        setSku('');
        return;
      }
      const prefix = name
        .split(/\s+/)
        .map(word => word[0])
        .filter(Boolean)
        .join('')
        .toUpperCase()
        .slice(0, 4);
      
      const random = Math.random().toString(36).substring(2, 6).toUpperCase();
      setSku(`${prefix}-${random}`);
    }
  };

  const handleSkuChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSku(e.target.value.toUpperCase());
    setSkuEdited(true);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImagePreview(null);
    const input = document.getElementById('image') as HTMLInputElement;
    if (input) input.value = '';
  };

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

      {/* Image Upload Section */}
      <div className="flex flex-col items-center justify-center space-y-4 pb-4">
        {imagePreview ? (
          <div className="relative size-32 rounded-2xl overflow-hidden border-2 border-primary/20 shadow-md">
            <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
            <button 
              type="button"
              onClick={clearImage}
              className="absolute top-1 right-1 p-1 rounded-full bg-destructive text-white hover:bg-destructive/90 transition-colors"
            >
              <X className="size-3" />
            </button>
          </div>
        ) : (
          <div className="relative size-32 rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted/30 flex flex-col items-center justify-center gap-2 group hover:border-primary/40 transition-all overflow-hidden">
            <div className="flex flex-col items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
              <Camera className="size-8 mb-1" />
              <span className="text-[10px] font-bold uppercase tracking-tight">Add Photo</span>
            </div>
            <input 
              id="image"
              name="image"
              type="file" 
              accept="image/*"
              capture="environment"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
          </div>
        )}
        <input type="hidden" name="imageUrl" value={imagePreview || ''} />
        <p className="text-[10px] text-muted-foreground font-medium">Upload or take a photo of the product</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input 
            id="name" 
            name="name" 
            placeholder="e.g. Mechanical Keyboard" 
            required 
            onChange={handleNameChange}
            className="rounded-xl h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku">SKU</Label>
          <Input 
            id="sku" 
            name="sku" 
            value={sku}
            onChange={handleSkuChange}
            placeholder="e.g. KB-K3-001" 
            required 
            className="rounded-xl h-11"
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
            className="rounded-xl h-11"
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
            className="rounded-xl h-11"
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
          className="rounded-xl h-11 px-6 font-normal"
        >
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={loading}
          className="rounded-xl h-11 px-8 font-normal"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </Button>
      </div>
    </form>
  );
}
