import React, { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { Product, ServiceType, CustomizationType } from '../types';
import { SlidersHorizontal, Plus, Trash2, Edit, Check, RefreshCw, Star, Sparkles, X } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AdminDashboard: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, resetProductsToDefault } = useAdmin();
  const { showToast } = useToast();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  const [newProd, setNewProd] = useState<Omit<Product, 'id' | 'createdAt' | 'updatedAt'>>({
    name: '',
    slug: '',
    category: 'Customized Gifts',
    service: 'customized-gifts',
    serviceName: 'Customized Gift Items',
    description: '',
    price: 499,
    compareAtPrice: 699,
    currency: '₹',
    images: ['https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800'],
    thumbnail: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&q=80&w=800',
    customizable: true,
    customizationType: 'image_text',
    stock: 50,
    featured: true,
    bestSeller: false,
    newProduct: true,
    tags: ['custom gift'],
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price) {
      showToast('Product name and price are required', 'error');
      return;
    }

    const generatedSlug = newProd.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    addProduct({
      ...newProd,
      slug: generatedSlug,
    });

    setIsAddModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      {/* Admin Title Bar */}
      <div className="bg-giftoria-charcoal-900 text-white p-6 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-giftoria-gold-500 text-giftoria-charcoal-900 font-bold">
            <SlidersHorizontal className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-2xl text-white">GIFTORIA Admin Architecture</h1>
            <p className="text-xs text-gray-400">Dynamic product catalog CRUD, price updates, &amp; stock management</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 bg-giftoria-gold-500 hover:bg-giftoria-gold-600 text-giftoria-charcoal-900 font-extrabold text-xs py-3 px-5 rounded-2xl transition-all shadow-gold"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Product</span>
          </button>

          <button
            onClick={resetProductsToDefault}
            className="flex items-center justify-center gap-1.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs py-3 px-4 rounded-2xl transition-all"
            title="Reset to initial catalog"
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset Catalog</span>
          </button>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-white rounded-3xl border border-giftoria-wine-800/10 shadow-sm overflow-hidden">
        <div className="p-4 border-b font-serif font-bold text-base text-giftoria-wine-900 flex justify-between items-center">
          <span>Manage Product Database ({products.length} Items)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-giftoria-charcoal-900">
            <thead className="bg-gray-50 uppercase text-[10px] font-bold text-gray-500 border-b">
              <tr>
                <th className="p-3.5">Product</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Price (₹)</th>
                <th className="p-3.5">Stock</th>
                <th className="p-3.5">Badges</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="p-3.5 flex items-center gap-3">
                    <img src={p.thumbnail} alt="" className="w-10 h-12 object-cover rounded-lg shrink-0" />
                    <div>
                      <div className="font-bold text-giftoria-wine-900 line-clamp-1">{p.name}</div>
                      <div className="text-[10px] text-gray-400 font-mono">{p.slug}</div>
                    </div>
                  </td>
                  <td className="p-3.5 font-medium">{p.serviceName}</td>
                  <td className="p-3.5 font-bold text-giftoria-wine-900">
                    ₹{p.price}
                    {p.compareAtPrice && <span className="text-[10px] text-gray-400 line-through ml-1">₹{p.compareAtPrice}</span>}
                  </td>
                  <td className="p-3.5">
                    <input
                      type="number"
                      value={p.stock}
                      onChange={(e) => updateProduct(p.id, { stock: parseInt(e.target.value) || 0 })}
                      className="w-16 bg-gray-50 border border-gray-300 rounded-lg p-1 text-center font-bold text-xs"
                    />
                  </td>
                  <td className="p-3.5">
                    <div className="flex gap-1">
                      <button
                        onClick={() => updateProduct(p.id, { bestSeller: !p.bestSeller })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                          p.bestSeller ? 'bg-giftoria-gold-500 text-giftoria-charcoal-900' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        BESTSELLER
                      </button>
                      <button
                        onClick={() => updateProduct(p.id, { featured: !p.featured })}
                        className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all ${
                          p.featured ? 'bg-giftoria-wine-800 text-white' : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        FEATURED
                      </button>
                    </div>
                  </td>
                  <td className="p-3.5 text-right space-x-2">
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      title="Delete Product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-serif font-bold text-lg text-giftoria-wine-900">Add New Product to Database</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700">Product Name *</label>
                <input
                  type="text"
                  placeholder="e.g. Personalized Magic Mug"
                  value={newProd.name}
                  onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                  className="w-full bg-gray-50 border rounded-xl p-2.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700">Service Category</label>
                  <select
                    value={newProd.service}
                    onChange={(e) => {
                      const val = e.target.value as ServiceType;
                      const names: Record<ServiceType, string> = {
                        'customized-gifts': 'Customized Gift Items',
                        '3d-printing': '3D Printing',
                        'dtf-printing': 'DTF Printing',
                        'sublimation-printing': 'Sublimation Printing',
                        'photo-frames': 'Photo Frames',
                      };
                      setNewProd({
                        ...newProd,
                        service: val,
                        serviceName: names[val],
                        category: names[val],
                      });
                    }}
                    className="w-full bg-gray-50 border rounded-xl p-2.5"
                  >
                    <option value="customized-gifts">Customized Gift Items</option>
                    <option value="3d-printing">3D Printing</option>
                    <option value="dtf-printing">DTF Printing</option>
                    <option value="sublimation-printing">Sublimation Printing</option>
                    <option value="photo-frames">Photo Frames</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700">Price (₹) *</label>
                  <input
                    type="number"
                    value={newProd.price}
                    onChange={(e) => setNewProd({ ...newProd, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-gray-50 border rounded-xl p-2.5 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700">Description</label>
                <textarea
                  rows={3}
                  value={newProd.description}
                  onChange={(e) => setNewProd({ ...newProd, description: e.target.value })}
                  className="w-full bg-gray-50 border rounded-xl p-2.5"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700">Image URL</label>
                <input
                  type="text"
                  value={newProd.images[0]}
                  onChange={(e) => setNewProd({ ...newProd, images: [e.target.value], thumbnail: e.target.value })}
                  className="w-full bg-gray-50 border rounded-xl p-2.5 text-xs"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProd.bestSeller}
                    onChange={(e) => setNewProd({ ...newProd, bestSeller: e.target.checked })}
                  />
                  <span>Mark as Bestseller</span>
                </label>
                <label className="inline-flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newProd.featured}
                    onChange={(e) => setNewProd({ ...newProd, featured: e.target.checked })}
                  />
                  <span>Mark as Featured</span>
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-giftoria-wine-800 hover:bg-giftoria-wine-900 text-white font-bold py-3 rounded-xl shadow-wine transition-all"
              >
                Save Product
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
