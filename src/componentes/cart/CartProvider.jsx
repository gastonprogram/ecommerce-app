/**
 * CartProvider.jsx - Proveedor de contexto para el carrito de compras
 * 
 * Este archivo implementa el Context de React para manejar el estado global
 * del carrito de compras. Permite que cualquier componente de la aplicación
 * pueda agregar, eliminar, actualizar productos del carrito.
 * 
 * Características principales:
 * - Estado global del carrito compartido entre componentes
 * - Persistencia automática en sessionStorage
 * - Funciones para gestión completa del carrito
 * - Hook personalizado useCart() para fácil acceso
 */

// src/componentes/cart/CartProvider.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const raw = localStorage.getItem("cart");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  // Persistir en localStorage
  useEffect(() => {
    try {
      localStorage.setItem("cart", JSON.stringify(cart));
    } catch {
      // noop
    }
  }, [cart]);

  // Añadir item (si ya existe suma cantidad)
  const addToCart = (product, qty = 1) => {
    setCart((prev) => {
      const idx = prev.findIndex((i) => String(i.id) === String(product.id));
      if (idx >= 0) {
        const copy = [...prev];
        const old = copy[idx];
        copy[idx] = { ...old, quantity: (old.quantity || 0) + qty };
        return copy;
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, image: product.image, quantity: qty }];
    });
  };

  // Eliminar item
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((i) => String(i.id) !== String(id)));
  };

  // Actualizar cantidad (min 1)
  const updateQuantity = (id, qty) => {
    const n = Math.max(parseInt(qty || 1, 10), 1);
    setCart((prev) =>
      prev.map((i) => (String(i.id) === String(id) ? { ...i, quantity: n } : i))
    );
  };

  // Vaciar carrito
  const clearCart = () => setCart([]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
    }),
    [cart]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
export default CartProvider;

