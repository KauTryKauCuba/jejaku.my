import React from 'react';
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
  ChevronRight,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { cn } from '@/lib/utils';

const mockItems = [
  { id: '1', name: 'Mechanical Keyboard K3', sku: 'KB-K3-001', category: 'Peripherals', stock: 124, minStock: 20, price: 'RM 299.00', status: 'In Stock' },
  { id: '2', name: 'USB-C Charging Cable', sku: 'CB-USBC-1M', category: 'Accessories', stock: 12, minStock: 50, price: 'RM 45.00', status: 'Low Stock' },
  { id: '3', name: 'Wireless Mouse Pro', sku: 'MS-PRO-W', category: 'Peripherals', stock: 0, minStock: 10, price: 'RM 189.00', status: 'Out of Stock' },
  { id: '4', name: 'Monitor Stand Alpha', sku: 'ST-AL-01', category: 'Furniture', stock: 45, minStock: 15, price: 'RM 159.00', status: 'In Stock' },
  { id: '5', name: 'Desk Lamp LED', sku: 'LP-LED-02', category: 'Furniture', stock: 8, minStock: 15, price: 'RM 89.00', status: 'Low Stock' },
];

export default function ItemListPage() {
  return (
    <div className="p-4 lg:p-8 space-y-6">
      {/* Header Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight">Item List</h1>
          <p className="text-muted-foreground mt-1 text-sm">
            Manage your inventory items, track stock levels and pricing.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="h-9 gap-2 font-normal">
            <Download className="size-4" />
            Export
          </Button>
          <Button size="sm" className="h-9 gap-2 font-normal">
            <Plus className="size-4" />
            Add Item
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
            <p className="text-lg font-bold">1,248</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
            <AlertTriangle className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Low Stock</p>
            <p className="text-lg font-bold">14</p>
          </div>
        </div>
        <div className="p-4 rounded-2xl border bg-card/50 flex items-center gap-4">
          <div className="size-10 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center">
            <CheckCircle2 className="size-5" />
          </div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">Out of Stock</p>
            <p className="text-lg font-bold">3</p>
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
              className="pl-10 h-10 rounded-xl bg-card border-border/60 focus:ring-primary/20"
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
      <div className="rounded-2xl border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b bg-muted/20">
                <th className="p-4 w-10 text-xs font-semibold text-muted-foreground">
                  <input type="checkbox" className="rounded border-muted-foreground/30 accent-primary" />
                </th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">
                  <div className="flex items-center gap-2 cursor-pointer hover:text-primary">
                    Product <ArrowUpDown className="size-3" />
                  </div>
                </th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Category</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Stock Level</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground text-right">Price</th>
                <th className="p-4 text-xs font-semibold text-muted-foreground">Status</th>
                <th className="p-4 w-10"></th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {mockItems.map((item) => (
                <tr key={item.id} className="hover:bg-muted/30 group transition-colors">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-muted-foreground/30 accent-primary" />
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-xl bg-muted/50 border flex items-center justify-center shrink-0">
                        <Package className="size-5 text-muted-foreground/60" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold group-hover:text-primary transition-colors">{item.name}</p>
                        <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-tight">{item.sku}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium px-2 py-1 rounded-lg bg-muted border text-muted-foreground">
                      {item.category}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="space-y-1.5 max-w-[140px]">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>{item.stock} units</span>
                        <span className="text-muted-foreground">min: {item.minStock}</span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div 
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            item.stock === 0 ? "bg-destructive w-0" : 
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
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg hover:bg-background shadow-sm">
                      <MoreHorizontal className="size-4 text-muted-foreground" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Placeholder */}
        <div className="p-4 bg-muted/10 border-t flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium">
            Showing <span className="text-foreground">1-5</span> of <span className="text-foreground">1,248</span> items
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium" disabled>Previous</Button>
            <Button variant="outline" size="sm" className="h-8 px-3 text-xs font-medium">Next</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
