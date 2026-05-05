import { createContext, useContext, useEffect, useMemo, useState } from "react";

type CartItem = {
  productId: number;
  slug: string;
  name: string;
  priceCents: number;
  imageUrl: string;
  quantity: number;
};

type AddCartItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

type CartContextValue = {
  items: CartItem[];
  itemCount: number;
  subtotalCents: number;
  addItem: (item: AddCartItemInput) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  removeItem: (productId: number) => void;
  clearCart: () => void;
};

const CART_STORAGE_KEY = "crown-baseball-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window === "undefined") return [];

    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as CartItem[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotalCents = items.reduce((sum, item) => sum + item.priceCents * item.quantity, 0);

    return {
      items,
      itemCount,
      subtotalCents,
      addItem: item => {
        setItems(current => {
          const existing = current.find(entry => entry.productId === item.productId);
          if (!existing) {
            return [
              ...current,
              {
                ...item,
                quantity: item.quantity ?? 1,
              },
            ];
          }

          return current.map(entry =>
            entry.productId === item.productId
              ? { ...entry, quantity: entry.quantity + (item.quantity ?? 1) }
              : entry,
          );
        });
      },
      updateQuantity: (productId, quantity) => {
        setItems(current =>
          current
            .map(item => (item.productId === productId ? { ...item, quantity } : item))
            .filter(item => item.quantity > 0),
        );
      },
      removeItem: productId => {
        setItems(current => current.filter(item => item.productId !== productId));
      },
      clearCart: () => {
        setItems([]);
      },
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
