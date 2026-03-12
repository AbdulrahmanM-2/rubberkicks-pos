'use client';

import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Package,
  TrendingUp,
  AlertCircle,
  Plus,
  Minus,
  X,
  Search,
  DollarSign,
  Archive,
} from 'lucide-react';
import { Product, CartItem, Sale, DashboardStats } from '@/lib/types';

export default function Home() {
  const [view, setView] = useState('pos');
  const [inventory, setInventory] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    totalSales: 0,
    totalRevenue: 0,
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [inventoryRes, salesRes, statsRes] = await Promise.all([
        fetch('/api/inventory'),
        fetch('/api/sales'),
        fetch('/api/stats'),
      ]);

      const inventoryData = await inventoryRes.json();
      const salesData = await salesRes.json();
      const statsData = await statsRes.json();

      if (inventoryData.success) setInventory(inventoryData.data);
      if (salesData.success) setSales(salesData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error('Error loading data:', error);
      showNotification('Error loading data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const data = await res.json();
      if (data.success) setStats(data.data);
    } catch (error) {
      console.error('Error refreshing stats:', error);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      showNotification('Product out of stock', 'error');
      return;
    }

    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        showNotification('Not enough stock', 'error');
        return;
      }
      setCart(
        cart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
    showNotification(`${product.name} added to cart`, 'success');
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateCartQuantity = (productId: string, change: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === productId) {
            const newQuantity = item.quantity + change;
            const product = inventory.find((p) => p.id === productId);
            if (newQuantity <= 0) return null;
            if (product && newQuantity > product.stock) {
              showNotification('Not enough stock', 'error');
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null)
    );
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      showNotification('Cart is empty', 'error');
      return;
    }

    try {
      const res = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: cart }),
      });

      const data = await res.json();

      if (data.success) {
        setCart([]);
        await loadData();
        await refreshStats();
        showNotification(`Sale completed: $${data.data.total.toFixed(2)}`, 'success');
      } else {
        showNotification(data.error || 'Failed to complete sale', 'error');
      }
    } catch (error) {
      console.error('Error completing sale:', error);
      showNotification('Error completing sale', 'error');
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (data.success) {
        await loadData();
        await refreshStats();
        setShowAddProduct(false);
        showNotification('Product added successfully', 'success');
      } else {
        showNotification(data.error || 'Failed to add product', 'error');
      }
    } catch (error) {
      console.error('Error adding product:', error);
      showNotification('Error adding product', 'error');
    }
  };

  const updateProduct = async (product: Product) => {
    try {
      const res = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product),
      });

      const data = await res.json();

      if (data.success) {
        await loadData();
        await refreshStats();
        setEditingProduct(null);
        showNotification('Product updated successfully', 'success');
      } else {
        showNotification(data.error || 'Failed to update product', 'error');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification('Error updating product', 'error');
    }
  };

  const deleteProduct = async (productId: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/inventory?id=${productId}`, {
        method: 'DELETE',
      });

      const data = await res.json();

      if (data.success) {
        await loadData();
        await refreshStats();
        showNotification('Product deleted successfully', 'success');
      } else {
        showNotification(data.error || 'Failed to delete product', 'error');
      }
    } catch (error) {
      console.error('Error deleting product:', error);
      showNotification('Error deleting product', 'error');
    }
  };

  const filteredInventory = inventory.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter((p) => p.stock < 10);
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl font-semibold text-slate-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 notification px-6 py-4 rounded-lg shadow-xl ${
            notification.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'
          } text-white font-medium`}
        >
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-3">
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <Archive className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">RubberKicks POS</h1>
                <p className="text-indigo-100 text-sm mt-1">
                  Inventory & Sales Management
                </p>
              </div>
            </div>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => setView('pos')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  view === 'pos'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <ShoppingCart className="inline w-5 h-5 mr-2" />
                Point of Sale
              </button>
              <button
                onClick={() => setView('inventory')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  view === 'inventory'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <Package className="inline w-5 h-5 mr-2" />
                Inventory
              </button>
              <button
                onClick={() => setView('reports')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  view === 'reports'
                    ? 'bg-white text-indigo-600 shadow-lg'
                    : 'bg-white/10 hover:bg-white/20 backdrop-blur-sm'
                }`}
              >
                <TrendingUp className="inline w-5 h-5 mr-2" />
                Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Stats */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-6 shadow-lg card-hover border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Products</p>
                <p className="text-3xl font-bold text-slate-800 mono">
                  {stats.totalProducts}
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-xl">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg card-hover border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Low Stock Items</p>
                <p className="text-3xl font-bold text-orange-600 mono">
                  {stats.lowStockItems}
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl">
                <AlertCircle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg card-hover border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-500 text-sm font-medium mb-1">Total Sales</p>
                <p className="text-3xl font-bold text-slate-800 mono">{stats.totalSales}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-xl">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl p-6 shadow-lg card-hover text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">Total Revenue</p>
                <p className="text-3xl font-bold mono">${stats.totalRevenue.toFixed(2)}</p>
              </div>
              <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
                <DollarSign className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {view === 'pos' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Products Grid */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h2 className="text-2xl font-bold text-slate-800">Products</h2>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search products..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 pr-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none w-64"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2">
                  {filteredInventory.map((product, index) => (
                    <div
                      key={product.id}
                      className="border border-slate-200 rounded-xl p-4 card-hover cursor-pointer slide-in bg-gradient-to-br from-white to-slate-50"
                      style={{ animationDelay: `${index * 0.05}s` }}
                      onClick={() => addToCart(product)}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-slate-800 text-lg mb-1">
                            {product.name}
                          </h3>
                          <p className="text-sm text-slate-500">{product.category}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-indigo-600 mono">
                            {product.price}/=
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm flex-wrap gap-2">
                        <div className="flex gap-2 flex-wrap">
                          <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-600">
                            Size: {product.size}
                          </span>
                          <span className="bg-slate-100 px-3 py-1 rounded-lg text-slate-600">
                            {product.color}
                          </span>
                        </div>
                        <span
                          className={`font-semibold ${
                            product.stock < 10 ? 'text-orange-600' : 'text-green-600'
                          }`}
                        >
                          Stock: {product.stock}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Cart */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200 sticky top-6">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">Shopping Cart</h2>

                {cart.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">Cart is empty</p>
                  </div>
                ) : (
                  <>
                    <div className="space-y-3 mb-6 max-h-80 overflow-y-auto">
                      {cart.map((item) => (
                        <div
                          key={item.id}
                          className="border border-slate-200 rounded-xl p-3 bg-slate-50"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div className="flex-1">
                              <h4 className="font-semibold text-slate-800">{item.name}</h4>
                              <p className="text-sm text-slate-500 mono">${item.price} each</p>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded"
                            >
                              <X className="w-5 h-5" />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateCartQuantity(item.id, -1)}
                                className="bg-slate-200 hover:bg-slate-300 p-1 rounded-lg transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="font-semibold mono w-8 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateCartQuantity(item.id, 1)}
                                className="bg-slate-200 hover:bg-slate-300 p-1 rounded-lg transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                            <span className="font-bold text-slate-800 mono">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="border-t-2 border-slate-200 pt-4 mb-6">
                      <div className="flex justify-between items-center">
                        <span className="text-xl font-bold text-slate-800">Total:</span>
                        <span className="text-3xl font-bold gradient-text mono">
                          ${cartTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={completeSale}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl"
                    >
                      Complete Sale
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {view === 'inventory' && (
          <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
              <h2 className="text-2xl font-bold text-slate-800">Inventory Management</h2>
              <button
                onClick={() => setShowAddProduct(true)}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                <Plus className="inline w-5 h-5 mr-2" />
                Add Product
              </button>
            </div>

            {lowStockItems.length > 0 && (
              <div className="bg-orange-50 border-l-4 border-orange-500 p-4 mb-6 rounded-r-xl">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
                  <span className="font-semibold text-orange-800">
                    {lowStockItems.length} item(s) low on stock (below 10 units)
                  </span>
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Product Name
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Category
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Price
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Stock
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Size
                    </th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-700">
                      Color
                    </th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-700">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {inventory.map((product) => (
                    <tr
                      key={product.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-4 font-medium text-slate-800">
                        {product.name}
                      </td>
                      <td className="py-4 px-4 text-slate-600">{product.category}</td>
                      <td className="py-4 px-4 font-semibold text-indigo-600 mono">
                        ${product.price}
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`font-semibold ${
                            product.stock < 10 ? 'text-orange-600' : 'text-green-600'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-slate-600">{product.size}</td>
                      <td className="py-4 px-4 text-slate-600">{product.color}</td>
                      <td className="py-4 px-4 text-right">
                        <button
                          onClick={() => setEditingProduct(product)}
                          className="text-indigo-600 hover:bg-indigo-50 px-3 py-1 rounded-lg mr-2 font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-600 hover:bg-red-50 px-3 py-1 rounded-lg font-medium transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'reports' && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl shadow-xl p-6 border border-slate-200">
              <h2 className="text-2xl font-bold text-slate-800 mb-6">Sales History</h2>

              {sales.length === 0 ? (
                <div className="text-center py-12">
                  <TrendingUp className="w-16 h-16 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">No sales recorded yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {sales.slice(0, 20).map((sale) => (
                    <div
                      key={sale.id}
                      className="border border-slate-200 rounded-xl p-4 bg-slate-50"
                    >
                      <div className="flex justify-between items-start mb-3 flex-wrap gap-2">
                        <div>
                          <p className="font-semibold text-slate-800">Sale #{sale.id}</p>
                          <p className="text-sm text-slate-500">
                            {new Date(sale.date).toLocaleString()}
                          </p>
                        </div>
                        <span className="text-xl font-bold text-emerald-600 mono">
                          ${sale.total.toFixed(2)}
                        </span>
                      </div>
                      <div className="space-y-1">
                        {sale.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between text-sm text-slate-600"
                          >
                            <span>
                              {item.name} × {item.quantity}
                            </span>
                            <span className="mono">
                              ${(item.price * item.quantity).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Add/Edit Product Modal */}
      {(showAddProduct || editingProduct) && (
        <ProductForm
          product={editingProduct}
          onSave={editingProduct ? updateProduct : addProduct}
          onClose={() => {
            setShowAddProduct(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}

interface ProductFormProps {
  product: Product | null;
  onSave: (product: any) => void;
  onClose: () => void;
}

function ProductForm({ product, onSave, onClose }: ProductFormProps) {
  const [formData, setFormData] = useState(
    product ? {
      ...product,
      price: product.price.toString(),
      stock: product.stock.toString(),
    } : {
      name: '',
      category: 'Boots',
      price: '',
      stock: '',
      size: '',
      color: '',
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 slide-in">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-slate-800">
            {product ? 'Edit Product' : 'Add New Product'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
            >
              <option>Boots</option>
              <option>Sneakers</option>
              <option>Sandals</option>
              <option>Clogs</option>
              <option>Slippers</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Stock
              </label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Size Range
              </label>
              <input
                type="text"
                required
                placeholder="e.g., 8-12"
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Color
              </label>
              <input
                type="text"
                required
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white rounded-xl font-semibold transition-all shadow-lg"
            >
              {product ? 'Update' : 'Add'} Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
