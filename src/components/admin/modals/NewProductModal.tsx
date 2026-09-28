import React, { useState } from 'react';
import { useBusiness } from '../../../context/BusinessContext';
import { Product } from '../../../types';
import { X, Package } from 'lucide-react';

interface NewProductModalProps {
  onClose: () => void;
}

export const NewProductModal: React.FC<NewProductModalProps> = ({ onClose }) => {
  const { addProduct, profile } = useBusiness();

  const [name, setName] = useState('');
  const [sku, setSku] = useState(`SKU-${Math.floor(1000 + Math.random() * 9000)}`);
  const [category, setCategory] = useState('Skincare & Botanicals');
  const [price, setPrice] = useState('65');
  const [costPrice, setCostPrice] = useState('22');
  const [stock, setStock] = useState('20');
  const [minStockAlert, setMinStockAlert] = useState('5');
  const [unit, setUnit] = useState('unit');
  const [description, setDescription] = useState('');
  const [iconType, setIconType] = useState<Product['iconType']>('bottle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    addProduct({
      name,
      sku,
      category,
      price: parseFloat(price) || 0,
      costPrice: parseFloat(costPrice) || 0,
      stock: parseInt(stock, 10) || 0,
      minStockAlert: parseInt(minStockAlert, 10) || 5,
      unit,
      description,
      iconType
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-stone-200 rounded-xl shadow-xl max-w-lg w-full p-6" onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-stone-700" />
            <h2 className="text-sm font-bold text-stone-900">Add New Inventory Product</h2>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          <div>
            <label className="block font-medium text-stone-700 mb-1">Product Name</label>
            <input 
              type="text" 
              placeholder="e.g. Cold-Pressed Squalane & Rosehip Nectar"
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
              <label className="block font-medium text-stone-700 mb-1">Retail Price ({profile.currency})</label>
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
              <label className="block font-medium text-stone-700 mb-1">Cost Price ({profile.currency})</label>
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
              <label className="block font-medium text-stone-700 mb-1">Unit Type</label>
              <input 
                type="text" 
                value={unit} 
                onChange={e => setUnit(e.target.value)} 
                placeholder="e.g. bottle, box"
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block font-medium text-stone-700 mb-1">Initial Stock</label>
              <input 
                type="number" 
                value={stock} 
                onChange={e => setStock(e.target.value)} 
                required
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Min Threshold</label>
              <input 
                type="number" 
                value={minStockAlert} 
                onChange={e => setMinStockAlert(e.target.value)} 
                required
                className="w-full px-3 py-1.5 font-mono border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none" 
              />
            </div>
            <div>
              <label className="block font-medium text-stone-700 mb-1">Visual Theme</label>
              <select
                value={iconType}
                onChange={e => setIconType(e.target.value as any)}
                className="w-full px-3 py-1.5 border border-stone-300 rounded-lg focus:ring-1 focus:ring-stone-900 focus:outline-none bg-white"
              >
                <option value="bottle">Bottle / Fluid</option>
                <option value="cream">Cream / Balm</option>
                <option value="bike_part">Mechanical Part</option>
                <option value="tool">Precision Tool</option>
                <option value="panel">Architectural Panel</option>
                <option value="speaker">Hardware / Audio</option>
                <option value="generic">General Item</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block font-medium text-stone-700 mb-1">Description & Ingredients / Specs</label>
            <textarea 
              rows={2} 
              value={description} 
              onChange={e => setDescription(e.target.value)} 
              placeholder="Material details, active botanicals, or mechanical specs..."
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
              Create Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
