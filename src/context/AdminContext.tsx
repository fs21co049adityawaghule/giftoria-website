import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { useToast } from './ToastContext';

interface AdminContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updatedFields: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  resetProductsToDefault: () => void;
}

const PRODUCTS_STORAGE_KEY = 'giftoria_products';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  const { showToast } = useToast();

  useEffect(() => {
    try {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
    } catch (e) {
      console.error('Failed to save products to localStorage', e);
    }
  }, [products]);

  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = `prod-${Date.now()}`;
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...newProdData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    setProducts((prev) => [newProduct, ...prev]);
    showToast(`Product "${newProduct.name}" added successfully!`, 'success');
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((prod) =>
        prod.id === id ? { ...prod, ...updatedFields, updatedAt: new Date().toISOString() } : prod
      )
    );
    showToast('Product updated successfully', 'success');
  };

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast('Product deleted', 'info');
  };

  const resetProductsToDefault = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.removeItem(PRODUCTS_STORAGE_KEY);
    showToast('Reset product database to default catalog', 'info');
  };

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
