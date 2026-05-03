// Add Category Form Component
'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { Textarea } from '../ui/Textarea';
import { addCategory } from '@/app/actions/categories';

interface AddCategoryFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export function AddCategoryForm({ onSuccess, onCancel }: AddCategoryFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const result = await addCategory(formData);

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

      <div className="space-y-2">
        <Label htmlFor="name">Category Name</Label>
        <Input 
          id="name" 
          name="name" 
          placeholder="e.g. Electronics, Furniture" 
          required 
          className="rounded-xl h-11"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea 
          id="description" 
          name="description" 
          placeholder="Describe what kind of products belong here..." 
          className="rounded-xl min-h-[100px] resize-none"
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
          {loading ? 'Creating...' : 'Create Category'}
        </Button>
      </div>
    </form>
  );
}
