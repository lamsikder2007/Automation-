/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  CheckCircle2,
  ExternalLink,
  Plus,
  RefreshCw,
  HardDrive,
  Tag,
} from 'lucide-react';
import { ProductItem } from '@/lib/types';

interface ProductsViewProps {
  products: ProductItem[];
  onNavigateTab: (tab: any) => void;
}

export const ProductsView: React.FC<ProductsViewProps> = ({ products, onNavigateTab }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category).filter(Boolean)))];

  const filtered = products.filter((p) => {
    const matchSearch =
      p.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    return matchSearch && matchCat;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-zinc-900">Store Product Catalog</h1>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200">
              Synced with Google Sheets
            </span>
          </div>
          <p className="text-xs text-zinc-500 mt-1">
            Browse verified products, prices in BDT, size matrices, and Google Drive product media.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigateTab('sheets')}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <span>Edit in Google Sheets</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-zinc-200 shadow-2xs">
        <div className="flex items-center gap-1.5 overflow-x-auto">
          {categories.map((cat: any) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-medium capitalize transition-all ${
                selectedCategory === cat
                  ? 'bg-zinc-900 text-white'
                  : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-3.5 h-3.5 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search SKU or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 bg-zinc-50 border border-zinc-300 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {filtered.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-zinc-200 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              <div className="aspect-4/3 bg-zinc-100 relative overflow-hidden flex items-center justify-center">
                <img
                  src={product.imageUrl || 'https://picsum.photos/seed/shirt1/600/600'}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 flex items-center gap-1">
                  <span className="px-2 py-0.5 rounded-md bg-zinc-900/80 backdrop-blur-xs text-white font-mono font-bold text-[10px]">
                    {product.sku}
                  </span>
                  {product.category && (
                    <span className="px-2 py-0.5 rounded-md bg-white/90 text-zinc-800 font-semibold text-[10px]">
                      {product.category}
                    </span>
                  )}
                </div>
                <div className="absolute top-2 right-2">
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold shadow-2xs ${
                      product.stock > 10
                        ? 'bg-emerald-500 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {product.stock} in stock
                  </span>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <div className="flex items-baseline justify-between">
                  <h3 className="text-xs font-bold text-zinc-900 line-clamp-1">{product.name}</h3>
                  <span className="text-sm font-extrabold text-zinc-900 shrink-0 ml-2">৳{product.price}</span>
                </div>

                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed">
                  {product.description}
                </p>

                <div className="pt-2 border-t border-zinc-100 space-y-1 text-[11px]">
                  <div className="flex items-center gap-1 text-zinc-600">
                    <span className="font-semibold text-zinc-400">Sizes:</span>
                    <span>{product.sizes.join(', ')}</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-600">
                    <span className="font-semibold text-zinc-400">Colors:</span>
                    <span>{product.colors.join(', ')}</span>
                  </div>
                  <div className="text-[10px] text-zinc-500 truncate">
                    <strong>Delivery:</strong> {product.delivery}
                  </div>
                </div>
              </div>
            </div>

            <div className="p-3 bg-zinc-50 border-t border-zinc-100 flex items-center justify-between text-[11px]">
              <span
                onClick={() => onNavigateTab('drive')}
                className="text-indigo-600 hover:underline cursor-pointer flex items-center gap-1 font-medium"
              >
                <HardDrive className="w-3 h-3 text-amber-500" />
                <span>Drive Photo Linked</span>
              </span>
              <span className="text-zinc-400 font-mono text-[10px]">৳{(product.price).toLocaleString()}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
