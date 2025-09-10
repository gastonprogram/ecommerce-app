
/**
 * Cart.jsx - Componente de visualización del carrito de compras
 * 
 * Este componente muestra todos los productos agregados al carrito,
 * permite modificar cantidades, eliminar productos individuales,
 * vaciar el carrito completo y muestra el total de la compra.
 * 
 * Características principales:
 * - Visualización de productos del carrito en tabla
 * - Controles para modificar cantidades
 * - Botones para eliminar productos individuales
 * - Botón para vaciar carrito completo
 * - Cálculo automático del total
 * - Mensaje informativo cuando el carrito está vacío
 */

import { useCart } from "./CartProvider";
import { useEffect, useState } from "react";
import "./Cart.css";

/**
 * Componente principal del carrito de compras
 * 
 * @returns {JSX.Element} Interfaz completa del carrito
 */
const Cart = () => {
  // Obtener funciones y estado del carrito desde el contexto
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  // Estado local para almacenar productos cargados desde la API
  const [products, setProducts] = useState([]);

  // Efecto para cargar productos desde la API al montar el componente
  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch(() => setProducts([]));
  }, []);

  /**
   * Función auxiliar para buscar un producto por ID
   * @param {number} id - ID del producto a buscar
   * @returns {Object|undefined} Producto encontrado o undefined
   */
  const getProduct = (id) => products.find((p) => p.id === id);
  
  /**
   * Calcular el total de la compra
   * Suma el precio de cada producto multiplicado por su cantidad
   */
  const total = cart.reduce((acc, item) => {
    const prod = getProduct(item.id);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);

  // Renderizado condicional: si el carrito está vacío, mostrar mensaje
  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <i className="fas fa-shopping-cart" style={{ fontSize: '4rem', color: 'var(--text-light)', marginBottom: '20px' }}></i>
        <h2>Tu carrito está vacío</h2>
        <p>Explora nuestro catálogo y agrega productos para comenzar tu compra</p>
      </div>
    );
  }

  // Renderizado principal: carrito con productos
  return (
    <div className="cart-container">
      <h2 className="cart-title">Carrito de compras ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})</h2>
      
      {/* Tabla de productos en el carrito */}
      <table className="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {/* Mapear cada producto del carrito */}
          {cart.map((item) => {
            const prod = getProduct(item.id) || {};
            const price = prod.price || item.price || 0;
            const subtotal = price * item.quantity;
            
            return (
              <tr key={item.id}>
                {/* Información del producto */}
                <td className="cart-product">
                  <img 
                    className="cart-product-img" 
                    src={prod.image ? `/assets/${prod.image}` : "https://via.placeholder.com/60x60"} 
                    alt={prod.name || item.name} 
                  />
                  <span>{prod.name || item.name || "Producto"}</span>
                </td>
                {/* Control de cantidad */}
                <td>
                  <input
                    className="cart-qty-input"
                    type="number"
                    min={1}
                    max={99}
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  />
                </td>
                {/* Precio unitario */}
                <td>USD {price.toFixed(2)}</td>
                {/* Subtotal del producto */}
                <td><strong>USD {subtotal.toFixed(2)}</strong></td>
                {/* Botón para eliminar producto */}
                <td>
                  <button 
                    className="cart-remove-btn" 
                    onClick={() => removeFromCart(item.id)}
                    title="Eliminar producto"
                  >
                    <i className="fas fa-trash"></i> Eliminar
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Acciones del carrito y total */}
      <div className="cart-actions">
        <h3 className="cart-total">Total: USD {total.toFixed(2)}</h3>
        <div>
          <button className="cart-clear-btn" onClick={clearCart}>
            <i className="fas fa-trash-alt"></i> Vaciar carrito
          </button>
          <button className="cart-checkout-btn">
            <i className="fas fa-credit-card"></i> Finalizar compra
          </button>
        </div>
      </div>
    </div>
  );
}

// Exportación por defecto del componente
export default Cart;