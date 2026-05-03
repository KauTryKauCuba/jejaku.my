'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  Download, 
  MoreHorizontal, 
  ArrowUpDown,
  Package,
  AlertTriangle,
  CheckCircle2,
  List as ListIcon,
  LayoutGrid,
  Pencil,
  Trash2,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';
import { Modal } from '@/components/ui/Modal';
import { AddItemForm } from './AddItemForm';
import { EditItemForm } from './EditItemForm';
import { ItemDetails } from './ItemDetails';
import { deleteItem, bulkDeleteItems } from '@/app/actions/inventory';
import { useRouter } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";

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
}

interface ItemListClientProps {
  initialItems: Item[];
  stats: {
    total: number;
    lowStock: number;
    outOfStock: number;
  };
}

export function ItemListClient({ initialItems, stats }: ItemListClientProps) {
  const router = useRouter();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [search, setSearch] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const [isBulkDeleteModalOpen, setIsBulkDeleteModalOpen] = useState(false);

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredItems.length && filteredItems.length > 0) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredItems.map(i => i.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const confirmBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    setIsBulkDeleting(true);
    const result = await bulkDeleteItems(selectedIds);
    if (result.success) {
      setIsBulkDeleteModalOpen(false);
      setSelectedIds([]);
      router.refresh();
    } else {
      alert(result.error || 'Failed to delete items');
    }
    setIsBulkDeleting(false);
  };

  const filteredItems = initialItems.filter(item => 
    item.name.toLowerCase().includes(search.toLowerCase()) ||
    item.sku.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (item: Item) => {
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const handleViewDetails = (item: Item) => {
    setSelectedItem(item);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteClick = (item: Item) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedItem) return;
    setIsDeleting(true);
    const result = await deleteItem(selectedItem.id);
    if (result.success) {
      setIsDeleteModalOpen(false);
      setSelectedItem(null);
    } else {
      alert(result.error || 'Failed to delete item');
    }
    setIsDeleting(false);
  };

  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Item List</h1>
          <p className="text-muted-foreground mt-1 text-sm font-normal">
            Manage your inventory items, track stock levels and pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2 font-normal">
            <Download className="size-4" />
            Export
          </Button>
          <Button size="sm" className="h-9 gap-2 font-normal" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="size-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Mini Stats Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
            <Package className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Total Items</p>
            <p className="text-lg font-bold">{stats.total}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Low Stock</p>
            <p className="text-lg font-bold text-amber-500">{stats.lowStock}</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Out of Stock</p>
            <p className="text-lg font-bold text-destructive">{stats.outOfStock}</p>
          </div>
        </div>
      </div>

      {/* Filters & Actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        <div className="flex flex-1 items-center gap-3 max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <Input 
              placeholder="Search items, SKU..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 h-10 rounded-xl bg-card border-border/60 focus:ring-primary/20 font-normal"
            />
          </div>
          <Button variant="outline" size="icon" className="h-10 w-10 rounded-xl shrink-0">
            <Filter className="size-4" />
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-muted/50 rounded-xl p-1 border">
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg bg-background shadow-sm text-primary">
              <ListIcon className="size-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-muted-foreground">
              <LayoutGrid className="size-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Item Table */}
      <div className="relative">
        {/* Bulk Actions Toolbar */}
        {selectedIds.length > 0 && (
          <div className="absolute -top-14 left-0 right-0 h-12 bg-primary rounded-xl flex items-center justify-between px-4 animate-in slide-in-from-bottom-2 duration-200 z-50">
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-primary-foreground">
                {selectedIds.length} items selected
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
      <div className="rounded-2xl border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="p-4 w-10 text-xs font-semibold text-muted-foreground">
                  <input 
                    type="checkbox" 
                    className="rounded border-muted-foreground/30 accent-primary cursor-pointer"
                    checked={selectedIds.length === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    Product <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">QR CODE</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Category</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Stock Level</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground text-right">Price</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredItems.length > 0 ? filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 group transition-colors">
                  <td className="p-4">
                    <input 
                      type="checkbox" 
                      className="rounded border-muted-foreground/30 accent-primary cursor-pointer"
                      checked={selectedIds.includes(item.id)}
                      onChange={() => toggleSelect(item.id)}
                    />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-lg bg-muted border overflow-hidden shrink-0 flex items-center justify-center">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.name} className="size-full object-cover" />
                        ) : (
                          <Package className="size-5 text-muted-foreground/40" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium">{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    {item.qrCode ? (
                      <div className="size-10 bg-white border rounded-lg p-0.5 group-hover:scale-110 transition-transform cursor-zoom-in" title={item.qrCode}>
                        <img 
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${item.qrCode}`} 
                          alt="QR"
                          className="size-full"
                        />
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted-foreground">None</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-muted border text-muted-foreground">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1.5 max-w-[140px]">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>{item.stock} {item.unit || 'units'}</span>
                        <span className="text-muted-foreground">min: {item.minStock}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            item.stock === 0 ? "bg-destructive w-full" : 
                            item.stock <= item.minStock ? "bg-amber-500 w-1/3" : "bg-emerald-500 w-3/4"
                          )}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <p className="text-sm font-bold">{item.price}</p>
                  </td>
                  <td className="p-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-0.5 rounded-full",
                      item.status === 'In Stock' && "bg-emerald-500/10 text-emerald-500",
                      item.status === 'Low Stock' && "bg-amber-500/10 text-amber-500",
                      item.status === 'Out of Stock' && "bg-destructive/10 text-destructive",
                    )}>
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background shadow-sm">
                          <MoreHorizontal className="size-4 text-muted-foreground" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40 rounded-xl">
                        <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground px-3">Actions</DropdownMenuLabel>
                        <DropdownMenuItem 
                          className="gap-2 px-3 py-2 cursor-pointer rounded-lg mx-1"
                          onClick={() => handleViewDetails(item)}
                        >
                          <Eye className="size-3.5" /> View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer rounded-lg mx-1" onClick={() => handleEdit(item)}>
                          <Pencil className="size-3.5" /> Edit Item
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 px-3 py-2 cursor-pointer text-destructive focus:text-destructive rounded-lg mx-1" onClick={() => handleDeleteClick(item)}>
                          <Trash2 className="size-3.5" /> Delete Item
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="p-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="size-12 rounded-2xl bg-muted/50 flex items-center justify-center text-muted-foreground">
                        <Package className="size-6" />
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold">No items found</p>
                        <p className="text-xs text-muted-foreground">Get started by adding your first product.</p>
                      </div>
                      <Button size="sm" className="h-9 mt-2 font-normal" onClick={() => setIsAddModalOpen(true)}>
                        <Plus className="size-4 mr-2" /> Add Your First Item
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

      {/* Add Item Modal */}
      <Modal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)} 
        title="Add New Product"
      >
        <AddItemForm 
          onSuccess={() => setIsAddModalOpen(false)} 
          onCancel={() => setIsAddModalOpen(false)} 
        />
      </Modal>

      {/* Edit Item Modal */}
      <Modal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        title="Edit Product"
      >
        {selectedItem && (
          <EditItemForm 
            item={selectedItem}
            onSuccess={() => {
              setIsEditModalOpen(false);
              setSelectedItem(null);
            }} 
            onCancel={() => {
              setIsEditModalOpen(false);
              setSelectedItem(null);
            }} 
          />
        )}
      </Modal>

      {/* Bulk Delete Confirmation Modal */}
      <Modal
        isOpen={isBulkDeleteModalOpen}
        onClose={() => setIsBulkDeleteModalOpen(false)}
        title="Delete Multiple Items"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-foreground">{selectedIds.length}</span> items? 
            This action cannot be undone and will remove all associated stock data for these products.
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
              {isBulkDeleting ? 'Deleting...' : 'Delete Items'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Item"
        className="max-w-md"
      >
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            Are you sure you want to delete <span className="font-bold text-foreground">{selectedItem?.name}</span>? 
            This action cannot be undone and will remove all associated stock data.
          </p>
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
              disabled={isDeleting}
              className="rounded-xl h-11 px-6 font-normal"
            >
              {isDeleting ? 'Deleting...' : 'Delete Item'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Item Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Product Details"
        className="max-w-lg"
      >
        {selectedItem && (
          <ItemDetails 
            item={selectedItem} 
            onClose={() => setIsDetailsModalOpen(false)} 
          />
        )}
      </Modal>
    </div>
  );
}
