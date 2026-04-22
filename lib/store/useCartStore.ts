import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from '@/lib/services/firebase-db';

export type CartItem = Product & { 
  quantity: number; 
  size: string; 
  cartItemId: string; 
};

interface CartState {
  items: CartItem[];
  addItem: (product: Product, size: string, price: number) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, size, price) => {
        const currentItems = get().items;
        const cartItemId = `${product.id}-${size}`;
        const existingItem = currentItems.find((item) => item.cartItemId === cartItemId);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.cartItemId === cartItemId
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...currentItems, { ...product, quantity: 1, size, cartItemId, price }] });
        }
      },
      removeItem: (cartItemId) => {
        set({
          items: get().items.filter((item) => item.cartItemId !== cartItemId),
        });
      },
      updateQuantity: (cartItemId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(cartItemId);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.cartItemId === cartItemId ? { ...item, quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
    }),
    {
      name: 'aseel-cart-storage',
    }
  )
);
