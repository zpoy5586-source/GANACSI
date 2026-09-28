import React, { useState } from 'react';
import { useBusiness } from '../../context/BusinessContext';
import { Product } from '../../types';
import { ItemVisual } from '../common/ItemVisual';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  AlertTriangle, 
  Check, 
  X, 
  Package, 
  Layers, 
  ArrowUpDown 
} from 'lucide-react';

interface ProductsManagerProps {
  onOpenNewProductModal: () => void;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({ onOpenNewProductModal }) => {
  const { products, profile, adjustProductStock, deleteProduct, updateProduct, addProduct } = useBusiness();

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'instock'>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Categories list
  const categories = Array.from(new Set(products.map(p => p.category)));

  // Filtered products
  const filteredProducts = products.filter(p => {
    const matchesSearch = 
      p.name.toLowerCase().includes(search.toLowerCase()) || 
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;

    const matchesStock = 
      stockFilter === 'all' ? true :
      stockFilter === 'low' ? p.stock <= p.minStockAlert :
      p.stock > p.minStockAlert;

    return matchesSearch && matchesCategory && matchesStock;
  });

  // Inventory valuation
  const totalStockUnits = products.reduce((sum, p) => sum + p.stock, 0);
  const totalWholesaleValue = products.reduce((sum, p) => sum + (p.costPrice * p.stock), 0);
  const totalRetailValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const potentialProfit = totalRetailValue - totalWholesaleValue;

  return (
    <div className="space-y-6">
      
      {/* Top Header Bar */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 font-mono">
            <span>Catalog & Inventory</span>
            <span aria-hidden="true">·</span>
            <span>{products.length} Active SKUs</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900 mt-1">
            Physical Product Inventory
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-0.5">
            Manage merchandise stock levels, unit wholesale costs, and retail price margins.
          </p>
        </div>

        <button
          onClick={onOpenNewProductModal}
          className="flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Valuation Metrics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Total Stock on Hand</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900">{totalStockUnits}</span>
            <span className="text-xs text-stone-400">units across {products.length} SKUs</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Inventory Asset Value</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tabular-nums text-stone-900">
              {profile.currency}{totalRetailValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-stone-400">retail valuation</span>
          </div>
        </div>

        <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs">
          <span className="text-xs text-stone-500 font-medium">Unrealized Gross Margin</span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold font-mono tabular-nums text-emerald-700">
              {profile.currency}{potentialProfit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <span className="text-xs text-stone-400">
              ({totalRetailValue > 0 ? Math.round((potentialProfit / totalRetailValue) * 100) : 0}% avg margin)
            </span>
          </div>
        </div>
      </div>

      {/* Filters & Search Bar */}
      <div className="bg-white border border-stone-200/90 rounded-xl p-4 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search product name, SKU, or category..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-stone-900 focus:bg-white transition-all"
            />
            {search && (
              <button 
                onClick={() => setSearch('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Stock Filter segmented control */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg shrink-0">
            <button
              onClick={() => setStockFilter('all')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                stockFilter === 'all' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              All Items
            </button>
            <button
              onClick={() => setStockFilter('low')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                stockFilter === 'low' ? 'bg-white text-amber-700 shadow-2xs font-semibold' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Low Stock Alert ({products.filter(p => p.stock <= p.minStockAlert).length})
            </button>
            <button
              onClick={() => setStockFilter('instock')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                stockFilter === 'instock' ? 'bg-white text-stone-900 shadow-2xs' : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Healthy Stock
            </button>
          </div>
        </div>

        {/* Category Pills (Functional filter buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-stone-100 scrollbar-none">
          <span className="text-[11px] text-stone-400 uppercase font-semibold mr-1 shrink-0">Category:</span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
              selectedCategory === 'all'
                ? 'bg-stone-900 text-white font-medium'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Categories ({products.length})
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-xs rounded-md whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white font-medium'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {cat} ({products.filter(p => p.category === cat).length})
            </button>
          ))}
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-stone-200/90 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 uppercase text-[10px] tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Item Details</th>
                <th className="py-3 px-3">SKU</th>
                <th className="py-3 px-3 text-right">Cost</th>
                <th className="py-3 px-3 text-right">Retail</th>
                <th className="py-3 px-3 text-right">Margin</th>
                <th className="py-3 px-4 text-center">Stock Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-xs text-stone-400">
                    No products matched your search or filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map(product => {
                  const marginPct = product.price > 0 
                    ? Math.round(((product.price - product.costPrice) / product.price) * 100) 
                    : 0;
                  const isLow = product.stock <= product.minStockAlert;
                  const isDepleted = product.stock === 0;

                  return (
                    <tr key={product.id} className="hover:bg-stone-50/60 transition-colors">
                      
                      {/* Name & Category */}
                      <td className="py-3 px-4 max-w-xs">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded border border-stone-200 overflow-hidden shrink-0">
                            <ItemVisual type={product.iconType} name={product.name} category={product.category} aspect="1:1" />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-stone-900 truncate">{product.name}</p>
                            <p className="text-[11px] text-stone-500 truncate">{product.category}</p>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="py-3 px-3 font-mono text-[11px] text-stone-600">{product.sku}</td>

                      {/* Cost */}
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-stone-500">
                        {profile.currency}{product.costPrice.toFixed(2)}
                      </td>

                      {/* Retail Price */}
                      <td className="py-3 px-3 text-right font-mono tabular-nums font-semibold text-stone-900">
                        {profile.currency}{product.price.toFixed(2)}
                      </td>

                      {/* Margin % */}
                      <td className="py-3 px-3 text-right font-mono tabular-nums text-emerald-700 font-medium">
                        {marginPct}%
                      </td>

                      {/* Stock Level with inline stepper */}
                      <td className="py-3 px-4 text-center">
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => adjustProductStock(product.id, -1)}
                            disabled={product.stock === 0}
                            className="w-5 h-5 flex items-center justify-center rounded border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-30 disabled:hover:bg-transparent"
                            title="Decrease 1"
                          >
                            -
                          </button>
                          
                          <span className={`min-w-[48px] font-mono tabular-nums font-semibold text-center ${
                            isDepleted ? 'text-rose-600' : isLow ? 'text-amber-700' : 'text-stone-900'
                          }`}>
                            {product.stock} <span className="text-[10px] text-stone-400 font-normal">{product.unit}</span>
                          </span>

                          <button
                            onClick={() => adjustProductStock(product.id, 1)}
                            className="w-5 h-5 flex items-center justify-center rounded border border-stone-200 text-stone-600 hover:bg-stone-100"
                            title="Increase 1"
                          >
                            +
                          </button>
                        </div>
                        {isLow && (
                          <div className="text-[10px] text-amber-700 font-medium mt-0.5 flex items-center justify-center gap-0.5">
                            <AlertTriangle className="w-2.5 h-2.5" /> Below min ({product.minStockAlert})
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="inline-flex items-center gap-1">
                          <button
                            onClick={() => setEditingProduct(product)}
                            className="p-1.5 text-stone-400 hover:text-stone-800 rounded transition-colors"
                            title="Edit product details"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete product "${product.name}"?`)) {
                                deleteProduct(product.id);
                              }
                            }}
                            className="p-1.5 text-stone-400 hover:text-rose-600 rounded transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Product Modal */}
      {editingProduct && (
        <EditProductModal 
          product={editingProduct} 
          currency={profile.currency}
          onClose={() => setEditingProduct(null)} 
          onSave={(updates) => {
            updateProduct(editingProduct.id, updates);
            setEditingProduct(null);
          }} 
        />
      )}

    </div>
  );
};

// Edit Product Modal Subcomponent
interface EditProductModalProps {
  product: Product;
  currency: string;
  onClose: () => void;
  onSave: (updates: Partial<Product>) => void;
}

const EditProductModal: React.FC<EditProductModalProps> = ({ product, currency, onClose, onSave }) => {
  const [name, setName] = useState(product.name);
  const [sku, setSku] = useState(product.sku);
  const [category, setCategory] = useState(product.category);
  const [price, setPrice] = useState(product.price.toString());
  const [costPrice, setCostPrice] = useState(product.costPrice.toString());
  const [stock, setStock] = useState(product.stock.toString());
  const [minStockAlert, setMinStockAlert] = useState(product.minStockAlert.toString());
  const [unit, setUnit] = useState(product.unit);
  const [description, setDescription] = useState(product.description);
  const [dimensions, setDimensions] = useState(product.dimensions || '');
  const [warranty, setWarranty] = useState(product.warranty || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name,
      sku,
      category,
      price: parseFloat(price) || 0,
      costPrice: parseFloat(costPrice) || 0,
      stock: parseInt(stock, 10) || 0,
      minStockAlert: parseInt(minStockAlert, 10) || 0,
      unit,
      description,
      dimensions,
      warranty
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <h2 className="text-sm font-bold text-stone-900">Edit Product</h2>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Product Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              required
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">SKU</label>
              <input 
                type="text" 
                value={sku} 
                onChange={e => setSku(e.target.value)} 
                required
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Category</label>
              <input 
                type="text" 
                value={category} 
                onChange={e => setCategory(e.target.value)} 
                required
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Retail Price ({currency})</label>
              <input 
                type="number" 
                step="0.01" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                required
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Wholesale Cost ({currency})</label>
              <input 
                type="number" 
                step="0.01" 
                value={costPrice} 
                onChange={e => setCostPrice(e.target.value)} 
                required
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Unit Label</label>
              <input 
                type="text" 
                value={unit} 
                onChange={e => setUnit(e.target.value)} 
                placeholder="e.g. bottle, pair"
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Current Stock Quantity</label>
              <input 
                type="number" 
                value={stock} 
                onChange={e => setStock(e.target.value)} 
                required
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Low-Stock Alert Level</label>
              <input 
                type="number" 
                value={minStockAlert} 
                onChange={e => setMinStockAlert(e.target.value)} 
                required
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Description</label>
            <textarea 
              rows={2} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-200">
            <button 
              type="button" 
              onClick={onClose} 
              className="px-3 py-1.5 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-4 py-1.5 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
