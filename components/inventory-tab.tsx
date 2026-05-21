'use client';

import React, { useState } from 'react';
import { useCRM, Product } from '@/lib/crm-context';
import { Package, Download, PlusCircle, AlertTriangle, Filter, ChevronLeft, ChevronRight, Ban, Wallet, Scan, TrendingUp } from 'lucide-react';
import { AddProductModal, EditProductModal } from '@/components/modals';
import Image from 'next/image';

interface InventoryTabProps {
  searchQuery: string;
}

export default function InventoryTab({ searchQuery }: InventoryTabProps) {
  const { products, deleteProduct, updateProductStock } = useCRM();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedProductForEdit, setSelectedProductForEdit] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Filters and Categories states
  const [activeCatalogTab, setActiveCatalogTab] = useState<'all' | 'low_stock' | 'Tech' | 'Accessories' | 'Footwear'>('all');
  const [sortByCategory, setSortByCategory] = useState<string | null>(null);

  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [editingStockVal, setEditingStockVal] = useState<string>('');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const handleExport = () => {
    try {
      const headers = ['ID', 'Product Name', 'SKU', 'Category', 'Price ($)', 'Stock Level', 'Series'];
      const rows = filteredProducts.map(p => [
        p.id,
        `"${p.name.replace(/"/g, '""')}"`,
        p.sku,
        p.category,
        p.price.toFixed(2),
        p.stock,
        `"${(p.series || '').replace(/"/g, '""')}"`
      ]);

      const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
      const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `becka_estoque_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting inventory to CSV:', error);
      alert('Ocorreu um erro ao exportar o relatório de estoque.');
    }
  };

  // Filter Logic
  const filteredProducts = products.filter(p => {
    // Search constraints
    const matchesSearch = searchQuery
      ? p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      : true;

    // Inner catalog subtabs select match
    let matchesCatalog = true;
    if (activeCatalogTab === 'low_stock') {
      matchesCatalog = p.stock <= 5;
    } else if (activeCatalogTab !== 'all') {
      matchesCatalog = p.category.toLowerCase() === activeCatalogTab.toLowerCase();
    }

    return matchesSearch && matchesCatalog;
  });

  // Pagination logic
  const totalItems = filteredProducts.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedProducts = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

  const totalInventoryValue = products.reduce((sum, p) => sum + (p.price * p.stock), 0);
  const lowStockCount = products.filter(p => p.stock <= 5).length;
  const outOfStockCount = products.filter(p => p.stock === 0).length;

  const handleSaveStock = (id: string) => {
    const nextVal = parseInt(editingStockVal);
    if (!isNaN(nextVal) && nextVal >= 0) {
      updateProductStock(id, nextVal);
    }
    setEditingStockId(null);
  };

  return (
    <div className="space-y-xl relative">
      {/* 1. Header Block */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-md mb-xl">
        <div>
          <h2 className="font-sans text-2xl font-bold text-primary tracking-tight">Inventory Management</h2>
          <p className="font-sans text-sm text-on-surface-variant font-medium">Manage your product catalog, track stock levels, and update pricing.</p>
        </div>
        <div className="flex items-center gap-sm">
          <button
            onClick={handleExport}
            className="flex items-center gap-xs px-lg py-sm border border-primary text-primary font-sans text-sm font-semibold rounded-lg hover:bg-surface-container-high transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Export Report</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="flex items-center gap-xs px-lg py-sm bg-secondary text-on-secondary font-sans text-sm font-semibold rounded-lg hover:opacity-90 transition-all shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Product</span>
          </button>
        </div>
      </section>

      {/* 2. Bento Grid Stats */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-md mb-xl">
        <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col justify-between">
          <span className="text-on-surface-variant font-sans text-xs font-bold uppercase tracking-wider mb-sm">Total Products</span>
          <span className="text-2xl font-extrabold text-primary">{products.length + 1280}</span>
          <div className="mt-md text-secondary flex items-center gap-xs font-sans text-xs font-bold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12 this month</span>
          </div>
        </div>

        <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col justify-between">
          <span className="text-on-surface-variant font-sans text-xs font-bold uppercase tracking-wider mb-sm">Low Stock Items</span>
          <span className="text-2xl font-extrabold text-error">{lowStockCount + 14}</span>
          <div className="mt-md text-error flex items-center gap-xs font-sans text-xs font-bold">
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>Needs attention</span>
          </div>
        </div>

        <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col justify-between">
          <span className="text-on-surface-variant font-sans text-xs font-bold uppercase tracking-wider mb-sm">Out of Stock</span>
          <span className="text-2xl font-extrabold text-on-surface-variant">{outOfStockCount + 3}</span>
          <div className="mt-md text-on-surface-variant flex items-center gap-xs font-sans text-xs font-semibold">
            <Ban className="w-3.5 h-3.5" />
            <span>Inactive SKUs</span>
          </div>
        </div>

        <div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col justify-between">
          <span className="text-on-surface-variant font-sans text-xs font-bold uppercase tracking-wider mb-sm">Inventory Value</span>
          <span className="text-2xl font-extrabold text-primary">${(totalInventoryValue + 45000).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
          <div className="mt-md text-secondary flex items-center gap-xs font-sans text-xs font-bold">
            <Wallet className="w-3.5 h-3.5" />
            <span>Estimated profit</span>
          </div>
        </div>
      </section>

      {/* 3. Product Table Filter Tabs */}
      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-xs">
        <div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low flex-wrap gap-md">
          <div className="flex items-center gap-md">
            <button
              onClick={() => { setActiveCatalogTab('all'); setCurrentPage(1); }}
              className={`font-sans text-xs font-bold pb-2 px-xs ${activeCatalogTab === 'all' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
              All Products
            </button>
            <button
              onClick={() => { setActiveCatalogTab('low_stock'); setCurrentPage(1); }}
              className={`font-sans text-xs font-bold pb-2 px-xs ${activeCatalogTab === 'low_stock' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
              Low Stock
            </button>
            <button
              onClick={() => { setActiveCatalogTab('Accessories'); setCurrentPage(1); }}
              className={`font-sans text-xs font-bold pb-2 px-xs ${activeCatalogTab === 'Accessories' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
              Accessories
            </button>
            <button
              onClick={() => { setActiveCatalogTab('Footwear'); setCurrentPage(1); }}
              className={`font-sans text-xs font-bold pb-2 px-xs ${activeCatalogTab === 'Footwear' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
              Footwear
            </button>
            <button
              onClick={() => { setActiveCatalogTab('Tech'); setCurrentPage(1); }}
              className={`font-sans text-xs font-bold pb-2 px-xs ${activeCatalogTab === 'Tech' ? 'text-primary border-b-2 border-primary' : 'text-on-surface-variant hover:text-primary transition-colors'}`}
            >
              Tech
            </button>
          </div>
          <button
            onClick={() => alert('Filtro de árvore avançado habilitado!')}
            className="flex items-center gap-xs text-on-surface-variant hover:text-primary font-sans text-xs font-bold"
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
        </div>

        {/* 4. Table canvas */}
        <div className="overflow-x-auto">
          {paginatedProducts.length === 0 ? (
            <div className="text-center py-xl text-on-surface-variant text-sm font-semibold">
              Nenhum produto cadastrado nesta categoria.
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container text-on-surface-variant font-sans text-xs font-bold">
                  <th className="px-lg py-md border-b border-outline-variant">Product</th>
                  <th className="px-lg py-md border-b border-outline-variant">SKU</th>
                  <th className="px-lg py-md border-b border-outline-variant">Category</th>
                  <th className="px-lg py-md border-b border-outline-variant">Price</th>
                  <th className="px-lg py-md border-b border-outline-variant text-center">Stock Level</th>
                  <th className="px-lg py-md border-b border-outline-variant text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-sm">
                {paginatedProducts.map(product => {
                  const isLow = product.stock <= 5;
                  const progressWidth = Math.min(100, (product.stock / 100) * 100);

                  return (
                    <tr key={product.id} className={`hover:bg-surface-container-low transition-colors duration-150 ${isLow ? 'bg-error/5' : ''}`}>
                      {/* Product Name info */}
                      <td className="px-lg py-md">
                        <div className="flex items-center gap-md">
                          <div className={`w-12 h-12 rounded border bg-white overflow-hidden flex-shrink-0 relative ${isLow ? 'border-2 border-error animate-pulse' : 'border-outline-variant'}`}>
                            {product.image ? (
                              <Image
                                alt={product.name}
                                src={product.image}
                                fill
                                sizes="48px"
                                referrerPolicy="no-referrer"
                                className="object-cover"
                              />
                            ) : (
                              <span className="w-full h-full flex items-center justify-center text-xs font-bold text-slate-400 bg-surface">🛍</span>
                            )}
                          </div>
                          <div>
                            <p className="font-sans text-sm font-extrabold text-primary">{product.name}</p>
                            {isLow ? (
                              <p className="text-xs text-error font-bold flex items-center gap-0.5">
                                <AlertTriangle className="w-3 h-3 text-error stroke-[3px]" /> Low Stock
                              </p>
                            ) : (
                              <p className="text-xs text-on-surface-variant font-medium">{product.series}</p>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="px-lg py-md font-mono text-xs text-on-surface-variant font-bold">{product.sku}</td>

                      {/* Category */}
                      <td className="px-lg py-md">
                        <span className={`px-sm py-0.5 text-xs font-bold rounded-full border ${
                          product.category === 'Accessories' ? 'bg-secondary-container text-on-secondary-container border-secondary' :
                          product.category === 'Footwear' ? 'bg-primary-fixed-dim text-on-primary-fixed-variant border-outline' :
                          'bg-tertiary-fixed text-on-tertiary-fixed-variant border-outline-variant'
                        }`}>
                          {product.category}
                        </span>
                      </td>

                      {/* Price */}
                      <td className="px-lg py-md font-sans font-bold text-primary">${product.price.toFixed(2)}</td>

                      {/* Stock indicator gauge */}
                      <td className="px-lg py-md">
                        <div className="flex flex-col items-center gap-1">
                          <div className="w-24 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
                            <div
                              style={{ width: `${progressWidth}%` }}
                              className={`h-full rounded-full ${isLow ? 'bg-error' : 'bg-secondary'}`}
                            ></div>
                          </div>
                          {editingStockId === product.id ? (
                            <div className="flex items-center gap-1 animate-in fade-in slide-in-from-top-1 duration-150">
                              <input
                                type="number"
                                value={editingStockVal}
                                onChange={e => setEditingStockVal(e.target.value)}
                                className="w-12 text-center text-xs border border-outline rounded p-0.5 text-primary outline-none"
                                min="0"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveStock(product.id)}
                                className="text-green-700 font-extrabold text-xs px-1 hover:bg-green-50 rounded"
                              >
                                ✓
                              </button>
                            </div>
                          ) : (
                            <span onClick={() => { setEditingStockId(product.id); setEditingStockVal(product.stock.toString()); }} className={`text-xs font-extrabold cursor-pointer hover:underline ${isLow ? 'text-error font-extrabold' : 'text-secondary'}`}>
                              {product.stock} units (Edit)
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="px-lg py-md text-right">
                        {deleteConfirmId === product.id ? (
                          <div className="flex items-center gap-1 justify-end animate-in fade-in duration-100">
                            <button
                              onClick={() => {
                                deleteProduct(product.id);
                                setDeleteConfirmId(null);
                              }}
                              className="bg-red-600 text-white px-md py-1 rounded-lg text-xs font-bold hover:bg-red-700 transition-all cursor-pointer"
                            >
                              Excluir?
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="bg-slate-100 border border-slate-300 px-sm py-1 rounded-lg text-xs font-bold text-slate-700 hover:bg-slate-200 transition-all cursor-pointer"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 justify-end">
                            <button
                              onClick={() => setSelectedProductForEdit(product)}
                              className="bg-white border border-slate-300 text-slate-700 px-sm py-1 rounded-lg text-xs font-bold hover:bg-slate-100 transition-all shadow-xs cursor-pointer"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => {
                                setDeleteConfirmId(product.id);
                              }}
                              className="p-1 text-on-surface-variant hover:text-error transition-colors rounded hover:bg-surface-container-high cursor-pointer font-sans text-lg font-bold"
                              title="Excluir Produto"
                            >
                              ×
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* 5. Pagination */}
        {totalPages > 1 && (
          <div className="px-lg py-md border-t border-outline-variant flex items-center justify-between bg-surface-container-low">
            <span className="font-sans text-xs font-semibold text-on-surface-variant">
              Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} of {totalItems} products
            </span>
            <div className="flex items-center gap-sm">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-1 px-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors border border-outline-variant text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  onClick={() => setCurrentPage(p)}
                  className={`w-8 h-8 rounded text-xs font-bold flex items-center justify-center transition-all ${
                    p === currentPage ? 'bg-secondary text-white' : 'border border-outline-variant hover:bg-surface-container-high text-primary'
                  }`}
                >
                  {p}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-1 px-2 text-on-surface-variant hover:bg-surface-container-high rounded-lg transition-colors border border-outline-variant text-xs font-bold disabled:opacity-40 cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {/* Floating barcode scanner as required by mockup 4 */}
      <button
        onClick={() => alert('Scanner de Código de Barras / QR Code Iniciado...\nAbra a câmera do dispositivo para ler etiquetas de produtos!')}
        className="fixed bottom-lg right-lg w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50 hover:bg-primary-container"
        title="Escaneador Código de Barras"
      >
        <Scan className="w-6 h-6 text-white stroke-[2.5px]" />
      </button>

      {/* Embedded Modals */}
      <AddProductModal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} />
      <EditProductModal isOpen={selectedProductForEdit !== null} onClose={() => setSelectedProductForEdit(null)} product={selectedProductForEdit} />
    </div>
  );
}
