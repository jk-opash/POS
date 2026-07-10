import React, { createContext, useState, useContext, useCallback } from 'react';
import { PRODUCTS } from '@/constants/products';

const ProductsContext = createContext();

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState(PRODUCTS);

  // Add a new product
  const addProduct = useCallback((newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  }, []);

  // Update an existing product
  const updateProduct = useCallback((id, updates) => {
    setProducts(prev => 
      prev.map(p => (p.id === id ? { ...p, ...updates } : p))
    );
  }, []);

  // Delete a product completely
  const deleteProduct = useCallback((id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  }, []);

  // Bulk update multiple products
  const bulkUpdate = useCallback((ids, updates) => {
    setProducts(prev => 
      prev.map(p => (ids.includes(p.id) ? { ...p, ...updates } : p))
    );
  }, []);

  // Detailed Stock Tracking: Reserve stock when added to cart
  const reserveStock = useCallback((productId, variantId, qty) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId || !p.inventory?.tracked) return p;
      
      // If variant, update variant stock
      if (variantId && p.variants) {
        return {
          ...p,
          variants: p.variants.map(v => 
            v.id === variantId 
              ? { ...v, stock: v.stock - qty, reserved: (v.reserved || 0) + qty }
              : v
          )
        };
      }
      
      // Standard product stock
      return {
        ...p,
        inventory: {
          ...p.inventory,
          available: p.inventory.available - qty,
          reserved: (p.inventory.reserved || 0) + qty
        }
      };
    }));
  }, []);

  // Detailed Stock Tracking: Release stock when removed from cart
  const releaseStock = useCallback((productId, variantId, qty) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId || !p.inventory?.tracked) return p;
      
      if (variantId && p.variants) {
        return {
          ...p,
          variants: p.variants.map(v => 
            v.id === variantId 
              ? { ...v, stock: v.stock + qty, reserved: Math.max(0, (v.reserved || 0) - qty) }
              : v
          )
        };
      }
      
      return {
        ...p,
        inventory: {
          ...p.inventory,
          available: p.inventory.available + qty,
          reserved: Math.max(0, (p.inventory.reserved || 0) - qty)
        }
      };
    }));
  }, []);

  // Detailed Stock Tracking: Permanently deduct stock upon transaction completion
  const deductStock = useCallback((productId, variantId, qty) => {
    setProducts(prev => prev.map(p => {
      if (p.id !== productId || !p.inventory?.tracked) return p;
      
      if (variantId && p.variants) {
        return {
          ...p,
          variants: p.variants.map(v => 
            v.id === variantId 
              ? { ...v, reserved: Math.max(0, (v.reserved || 0) - qty) }
              : v
          )
        };
      }
      
      return {
        ...p,
        inventory: {
          ...p.inventory,
          current: p.inventory.current - qty,
          reserved: Math.max(0, (p.inventory.reserved || 0) - qty)
        }
      };
    }));
  }, []);

  return (
    <ProductsContext.Provider 
      value={{ 
        products, 
        addProduct, 
        updateProduct, 
        deleteProduct,
        bulkUpdate,
        reserveStock,
        releaseStock,
        deductStock
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductsProvider');
  }
  return context;
}
