
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
 * - Integración con API de productos
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
        console.log(data);
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
    return acc + (prod ? prod.precio * item.quantity : 0);
  }, 0);

  // Función para agregar productos de prueba al carrito
  const { addToCart } = useCart();
  /**
   * Función para agregar productos de prueba al carrito
   * Útil para testing y demostración
   */
  const agregarPrueba = () => {
    // IDs de productos de ejemplo (ajusta según tu db.json)
    const ids = [1, 2, 3];
    ids.forEach((id) => {
      const prod = products.find((p) => p.id === id);
      if (prod) addToCart(prod);
    });
  };


  // Renderizado condicional: si el carrito está vacío, mostrar mensaje
  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <button className="cart-add-demo-btn" onClick={agregarPrueba}>Agregar productos de prueba</button>
      </div>
    );
  }

  // Renderizado principal: carrito con productos
  return (
    <div className="cart-container">
      <h2 className="cart-title">Carrito de compras</h2>
      
      {/* Tabla de productos en el carrito */}
      <table className="cart-table">
        <thead>
          <tr>
            <th>Producto</th>
            <th>Cantidad</th>
            <th>Precio</th>
            <th>Subtotal</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {/* Mapear cada producto del carrito */}
          {cart.map((item) => {
            const prod = getProduct(item.id) || {};
            return (
              <tr key={item.id}>
                {/* Información del producto */}
                <td className="cart-product">
                  <img className="cart-product-img" src={prod.imagen} alt={prod.nombre} />
                  <span>{prod.nombre || "Producto"}</span>
                </td>
                {/* Control de cantidad */}
                <td>
                  <input
                    className="cart-qty-input"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  />
                </td>
                {/* Precio unitario */}
                <td>${prod.precio?.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                {/* Subtotal del producto */}
                <td>${((prod.precio || 0) * item.quantity).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                {/* Botón para eliminar producto */}
                <td>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      
      {/* Acciones del carrito y total */}
      <div className="cart-actions">
        <h3 className="cart-total">Total: ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</h3>
        <button className="cart-clear-btn" onClick={clearCart}>Vaciar carrito</button>
        <button className="cart-checkout-btn">Finalizar compra</button>
      </div>
    </div>
  );
}

// Exportación por defecto del componente
export default Cart;