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

import { createContext, useContext, useState, useEffect } from "react";

// Crear el contexto del carrito que será compartido entre componentes
const CartContext = createContext();

/**
 * Componente proveedor del contexto del carrito
 * 
 * Envuelve la aplicación y proporciona el estado del carrito
 * y todas las funciones necesarias para manejarlo a todos
 * los componentes hijos.
 * 
 * @param {Object} props - Propiedades del componente
 * @param {ReactNode} props.children - Componentes hijos que tendrán acceso al contexto
 */
const CartProvider = ({ children }) => {
  // Inicializa el carrito desde sessionStorage si existe
  const [cart, setCart] = useState(() => {
    const stored = sessionStorage.getItem("cart");
    return stored ? JSON.parse(stored) : [];
  });

  // Guarda el carrito en sessionStorage cada vez que cambia
  useEffect(() => {
    sessionStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /**
   * Función para agregar un producto al carrito
   * Si el producto ya existe, incrementa su cantidad
   * Si es nuevo, lo agrega con cantidad 1
   * 
   * @param {Object} product - Producto a agregar al carrito
   */
  const addToCart = (product) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === product.id);
      if (exists) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  /**
   * Función para eliminar completamente un producto del carrito
   * 
   * @param {number} id - ID del producto a eliminar
   */
  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  /**
   * Función para vaciar completamente el carrito
   */
  const clearCart = () => setCart([]);

  /**
   * Función para actualizar la cantidad de un producto específico
   * La cantidad mínima es 1
   * 
   * @param {number} id - ID del producto
   * @param {number} quantity - Nueva cantidad
   */
  const updateQuantity = (id, quantity) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
      )
    );
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

// Exportación por defecto del componente provider
export default CartProvider;

/**
 * Hook personalizado para usar el contexto del carrito
 * Proporciona acceso fácil al estado y funciones del carrito
 * 
 * @returns {Object} Estado y funciones del carrito
 * 
 * Ejemplo de uso:
 * const { cart, addToCart, removeFromCart } = useCart();
 */
export function useCart() {
  return useContext(CartContext);
}
