'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  ArrowUpDown,
  Tags,
  Pencil,
  Trash2,
  Package2,
  Clock
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { AddCategoryForm } from '@/components/inventory/AddCategoryForm';
import { EditCategoryForm } from '@/components/inventory/EditCategoryForm';
import { deleteCategory, bulkDeleteCategories } from '@/app/actions/categories';

interface Category {
  id: string;
  name: string;
  description: string;
  itemCount: number;
  createdAt: string;
}

interface CategoryListClientProps {
  initialCategories: Category[];
  stats: {
    total: number;
    totalItems: number;
  };
}

export function CategoryListClient({ initialCategories, stats }: CategoryListClientProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [search, setSearch] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const filteredCategories = initialCategories.filter(cat => 
    cat.name.toLowerCase().includes(search.toLowerCase()) ||
    cat.description.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCategories.length && filteredCategories.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleEdit = (category: Category) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedCategory) return;
    setIsDeleting(true);
    const result = await deleteCategory(selectedCategory.id);
    if (result.success) {
      setIsDeleteModalOpen(false);
      setSelectedCategory(null);
      router.refresh();
    } else {
      alert(result.error || 'Failed to delete category');
    }
    setIsDeleting(false);
  };

  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    const result = await bulkDeleteCategories(selectedIds);
    if (result.success) {
      setIsBulkDeleteModalOpen(false);
      setSelectedIds([]);
      router.refresh();
    } else {
      alert(result.error || 'Failed to delete categories');
    }
    setIsBulkDeleting(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-foreground">Categories</h1>
          <p className="text-muted-foreground mt-1 text-sm font-normal">
            Organize your products into logical categories for better management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" className="h-9 gap-2 font-normal" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="size-4" />
            Add Category
          </Button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4 transition-all hover:border-primary/20">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Tags className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Categories</p>
            <p className="text-lg font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4 transition-all hover:border-primary/20">
          <div className="size-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <Package2 className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Categorized Items</p>
            <p className="text-lg font-bold">{stats.totalItems}</p>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-3 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search categories..." 
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

      {/* Category Table */}
      <div className="relative">
        {/* Bulk Actions Toolbar */}
        {selectedIds.length > 0 && (
          <div className="absolute -top-14 left-0 right-0 h-12 bg-primary rounded-xl flex items-center justify-between px-4 animate-in slide-in-from-bottom-2 duration-200 z-50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-primary-foreground">
                {selectedIds.length} categories selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 text-primary-foreground hover:bg-white/10"
                onClick={() => setSelectedIds([])}
              >
                Clear
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                className="h-8 bg-white text-destructive hover:bg-white/90 border-0"
                onClick={() => setIsBulkDeleteModalOpen(true)}
              >
                <Trash2 className="size-4 mr-2" />
                Delete Selected
              </Button>
            </div>
          </div>
        )}

        <div className="rounded-2xl border bg-card overflow-hidden transition-all">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b bg-muted/20">
                  <th className="p-4 w-10 text-xs font-semibold text-muted-foreground">
                    <input 
                      type="checkbox" 
                      className="rounded border-muted-foreground/30 accent-primary cursor-pointer"
                      checked={selectedIds.length === filteredCategories.length && filteredCategories.length > 0}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground">
                    <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                      Name <ArrowUpDown className="size-3" />
                    </div>
                  </th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground">Description</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground text-center">Items</th>
                  <th className="p-4 text-xs font-semibold text-muted-foreground">Date Created</th>
                  <th className="p-4 w-10"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredCategories.length > 0 ? filteredCategories.map((cat, i) => (
                  <tr 
                    key={cat.id} 
                    className="hover:bg-muted/40 group transition-all duration-200"
                  >
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        className="rounded border-muted-foreground/30 accent-primary cursor-pointer transition-transform group-hover:scale-110"
                        checked={selectedIds.includes(cat.id)}
                        onChange={() => toggleSelect(cat.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="size-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                          <Tags className="size-4" />
                        </div>
                        <p className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">{cat.name}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-xs text-muted-foreground line-clamp-1 font-medium">{cat.description}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center justify-center size-7 rounded-lg bg-primary/5 text-primary text-[11px] font-bold border border-primary/10">
                        {cat.itemCount}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground font-medium">
                        <Clock className="size-3.5 text-muted-foreground/50" />
                        {cat.createdAt}
                      </div>
                    </td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background">
                            <MoreHorizontal className="size-4 text-muted-foreground" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48 rounded-xl">
                          <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground px-3">Category Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer rounded-lg mx-1" onClick={() => handleEdit(cat)}>
                            <Pencil className="size-3.5" /> Edit Category
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer text-destructive focus:text-destructive rounded-lg mx-1" onClick={() => handleDeleteClick(cat)}>
                            <Trash2 className="size-3.5" /> Delete Category
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
                          <Tags className="size-8" />
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-bold text-foreground">No categories found</p>
                          <p className="text-xs text-muted-foreground max-w-[200px] mx-auto">Try adjusting your filters or create your first category to get started.</p>
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

      {/* Modals */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Create New Category"
      >
        <AddCategoryForm 
          onSuccess={() => setIsAddModalOpen(false)} 
          onCancel={() => setIsAddModalOpen(false)} 
        />
      </Modal>

      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Category"
      >
        {selectedCategory && (
          <EditCategoryForm 
            category={selectedCategory}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedCategory(null);
            }} 
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedCategory(null);
            }} 
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Category"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-foreground">{selectedCategory?.name}</span>? 
            This action cannot be undone.
          </p>
          {selectedCategory && selectedCategory.itemCount > 0 && (
            <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20 flex gap-3">
              <Trash2 className="size-5 text-destructive shrink-0" />
              <p className="text-xs text-destructive font-medium">
                This category is currently linked to {selectedCategory.itemCount} items. You must reassign or delete those items first.
              </p>
            </div>
          )}
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isDeleting}
              className="rounded-xl h-11 font-normal"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isDeleting || (selectedCategory?.itemCount || 0) > 0}
              className="rounded-xl h-11 px-6 font-normal"
            >
              {isDeleting ? 'Deleting...' : 'Delete Category'}
            </Button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        title="Delete Multiple Categories"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-foreground">{selectedIds.length}</span> categories? 
            This action cannot be undone.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button 
              variant="outline" 
              onClick={() => setIsBulkDeleteModalOpen(false)}
              disabled={isBulkDeleting}
              className="rounded-xl h-11 font-normal"
            >
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmBulkDelete}
              disabled={isBulkDeleting}
              className="rounded-xl h-11 px-6 font-normal"
            >
              {isBulkDeleting ? 'Deleting...' : 'Delete Categories'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
