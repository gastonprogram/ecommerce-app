
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
import { checkoutWithStock } from "../../services/productService";
import "./Cart.css";

/**
 * Componente principal del carrito de compras
 * 
 * @returns {JSX.Element} Interfaz completa del carrito
 */
// Componente principal del carrito de compras
// Se agregan comentarios en línea para la funcionalidad de cupones y descuentos

const Cart = () => {
  // Obtener funciones y estado del carrito desde el contexto
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();

  // Estado local para almacenar productos cargados desde la API
  const [products, setProducts] = useState([]);

  // Estado para el cupón y mensajes
  const [coupon, setCoupon] = useState(""); // Guarda el texto del cupón ingresado
  const [discount, setDiscount] = useState(0); // Porcentaje de descuento aplicado
  const [couponMsg, setCouponMsg] = useState(""); // Mensaje informativo del cupón
  // Estado de proceso de checkout
  const [processing, setProcessing] = useState(false);
  const [checkoutMsg, setCheckoutMsg] = useState("");
  const [checkoutError, setCheckoutError] = useState("");
  // Modal de éxito y resumen de compra
  const [showSuccess, setShowSuccess] = useState(false);
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [purchasedTotal, setPurchasedTotal] = useState(0);
  const [purchasedTotalWithDiscount, setPurchasedTotalWithDiscount] = useState(0);

  // Efecto para cargar productos desde la API al montar el componente
  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch(() => setProducts([]));
  }, []);

  // Handler para aplicar cupón de descuento
  const handleApplyCoupon = () => {
    // Validar formato DESC(número)
    const regex = /^DESC(\d{1,2})$/i;
    const match = coupon.match(regex);
    if (match) {
      const value = parseInt(match[1]);
      // Validar rango de descuento (1-99)
      if (value >= 1 && value <= 99) {
        setDiscount(value); // Aplica el descuento
        setCouponMsg(`Cupón aplicado: ${value}% de descuento`);
      } else {
        setDiscount(0);
        setCouponMsg("El cupón debe ser entre 1 y 99%");
      }
    } else {
      setDiscount(0);
      setCouponMsg("Cupón inválido. Usa el formato DESC10, DESC25, etc.");
    }
  };

  // Calcula el precio con descuento aplicado
  const applyDiscount = (amount) => discount > 0 ? amount * (1 - discount / 100) : amount;

  // Busca un producto por ID
  const getProduct = (id) => products.find((p) => p.id === id);

  // Calcula el total del carrito (sin descuento)
  const total = cart.reduce((acc, item) => {
    const prod = getProduct(item.id);
    return acc + (prod ? prod.price * item.quantity : 0);
  }, 0);

  // Finalizar compra: valida y descuenta stock vía servicio, luego limpia carrito
  const handleCheckout = async () => {
    try {
      setProcessing(true);
      setCheckoutMsg("");
      setCheckoutError("");

      // Ejecutar checkout (valida stock y descuenta en el servidor)
      const result = await checkoutWithStock(cart.map(({ id, quantity }) => ({ id, quantity })));
      if (!result.success) {
        setCheckoutError(result.message || "No se pudo procesar la compra.");
        return;
      }

      // Preparar resumen de compra ANTES de limpiar el carrito
      const summaryItems = cart.map((item) => {
        const prod = getProduct(item.id) || {};
        const unitPrice = typeof prod.price === 'number' ? prod.price : (item.price || 0);
        return {
          id: item.id,
          name: prod.name || item.name || 'Producto',
          quantity: item.quantity,
          price: unitPrice,
          subtotal: unitPrice * item.quantity,
          image: prod.image || item.image
        };
      });
      const summaryTotal = summaryItems.reduce((acc, it) => acc + it.subtotal, 0);
      const summaryTotalWithDiscount = discount > 0 ? summaryTotal * (1 - discount / 100) : summaryTotal;

      setPurchasedItems(summaryItems);
      setPurchasedTotal(summaryTotal);
      setPurchasedTotalWithDiscount(summaryTotalWithDiscount);
      setShowSuccess(true);

      // Si todo ok: limpiar carrito y mostrar mensaje
      clearCart();
      setCheckoutMsg("¡Compra realizada con éxito! Gracias por tu compra.");
      // Limpiar cupón
      setCoupon("");
      setDiscount(0);
      setCouponMsg("");
    } catch (err) {
      setCheckoutError("Ocurrió un error al finalizar la compra. Intenta nuevamente.");
    } finally {
      setProcessing(false);
    }
  };

  // Si el carrito está vacío, muestra mensaje
  if (cart.length === 0 && !showSuccess) {
    return (
      <div className="cart-empty">
        <i className="fas fa-shopping-cart" style={{ fontSize: '4rem', color: 'var(--text-light)', marginBottom: '20px' }}></i>
        <h2>Tu carrito está vacío</h2>
        <p>Explora nuestro catálogo y agrega productos para comenzar tu compra</p>
      </div>
    );
  }

  // Render principal del carrito
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
            const subtotalDiscount = applyDiscount(subtotal); // Subtotal con descuento

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
                    max={prod?.stock ?? 99}
                    value={item.quantity}
                    onChange={e => {
                      const parsed = parseInt(e.target.value) || 1;
                      const cap = prod && typeof prod.stock === 'number' ? Math.min(parsed, prod.stock) : parsed;
                      updateQuantity(item.id, cap);
                    }}
                  />
                </td>
                {/* Precio unitario */}
                <td>
                  USD {price.toFixed(2)}
                </td>
                {/* Subtotal del producto con descuento visual */}
                <td>
                  {/* Si hay descuento, muestra el subtotal original tachado y el nuevo en verde */}
                  {discount > 0 ? (
                    <>
                      <span style={{ textDecoration: "line-through", color: "#888", marginRight: 8 }}>
                        USD {subtotal.toFixed(2)}
                      </span>
                      <span style={{ color: "green", fontWeight: "bold" }}>
                        USD {subtotalDiscount.toFixed(2)} (-{discount}%)
                      </span>
                    </>
                  ) : (
                    <strong>USD {subtotal.toFixed(2)}</strong>
                  )}
                </td>
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
      <div 
        style={{
          display: "inline-flex",
          alignItems: "center",
          border: "2px solid #e3e6ee",
          borderRadius: "16px",
          padding: "8px 24px",
          background: "#fff",
          boxShadow: "none",
          marginBottom: "12px",
          minWidth: "120px",
          minHeight: "48px",
          gap: "8px"
        }}
      >
        <span style={{ fontSize: "1.5rem", fontWeight: "500", color: "#1a2341" }}>
          <i className="fas fa-ticket-alt" style={{ marginRight: "8px", color: "#1a2341" }}></i>
        </span>
        <input
          type="text"
          value={coupon}
          onChange={e => setCoupon(e.target.value)}
          placeholder="Ingresa tu cupón (ej: DESC10)"
          style={{
            fontFamily: "inherit",
            fontSize: "1rem",
            border: "none",
            background: "transparent",
            color: "#1a2341",
            padding: "6px 10px",
            outline: "none",
            minWidth: "80px"
          }}
        />
        <button
          className="cart-clear-btn"
          style={{ height: "32px", padding: "0 16px", display: "flex", alignItems: "center", borderRadius: "8px" }}
          onClick={handleApplyCoupon}
        >
          Aplicar cupón
        </button>
      </div>
      {/* Mensaje informativo del cupón */}
      <div style={{ marginTop: "10px", color: discount > 0 ? "var(--success)" : "var(--danger)", fontWeight: "bold" }}>
        {couponMsg}
      </div>
      {/* Acciones del carrito y total */}
      <div className="cart-actions">
        {/* Total del carrito con descuento visual */}
        <h3 className="cart-total">
          {/* Si hay descuento, muestra el total original tachado y el nuevo en verde */}
          {discount > 0 ? (
            <>
              <span style={{ textDecoration: "line-through", color: "#888", marginRight: 8 }}>
                Total: USD {total.toFixed(2)}
              </span>
              <span style={{ color: "green", fontWeight: "bold" }}>
                USD {applyDiscount(total).toFixed(2)} (-{discount}%)
              </span>
            </>
          ) : (
            <>Total: USD {total.toFixed(2)}</>
          )}
        </h3>
        <div>
          <button className="cart-clear-btn" onClick={clearCart}>
            <i className="fas fa-trash-alt"></i> Vaciar carrito
          </button>
          <button className="cart-checkout-btn" onClick={handleCheckout} disabled={processing}>
            <i className="fas fa-credit-card"></i> Finalizar compra
          </button>
        </div>
      </div>
      {/* Mensajes de checkout */}
      {checkoutMsg && (
        <div style={{ marginTop: 12, color: "var(--success)", fontWeight: "bold" }}>{checkoutMsg}</div>
      )}
      {checkoutError && (
        <div style={{ marginTop: 12, color: "var(--danger)", fontWeight: "bold" }}>{checkoutError}</div>
      )}
      {/* Modal de compra exitosa con resumen */}
      {showSuccess && (
        <div className="modal-overlay" role="dialog" aria-modal="true">
          <div className="modal-content">
            <div className="modal-header">
              <h3><i className="fas fa-check-circle" style={{ color: 'var(--success)', marginRight: 8 }}></i> Compra exitosa</h3>
              <button className="modal-close" onClick={() => setShowSuccess(false)} aria-label="Cerrar">×</button>
            </div>
            <div className="modal-body">
              <p>Gracias por tu compra. Este es el resumen:</p>
              <div className="purchase-summary">
                <table className="summary-table">
                  <thead>
                    <tr>
                      <th>Producto</th>
                      <th>Cant.</th>
                      <th>Precio</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchasedItems.map((it) => (
                      <tr key={it.id}>
                        <td className="summary-product">
                          {it.image ? (
                            <img className="summary-img" src={`/assets/${it.image}`} alt={it.name} />
                          ) : null}
                          <span>{it.name}</span>
                        </td>
                        <td>{it.quantity}</td>
                        <td>USD {Number(it.price).toFixed(2)}</td>
                        <td><strong>USD {Number(it.subtotal).toFixed(2)}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="summary-totals">
                  {discount > 0 ? (
                    <>
                      <div className="summary-line">
                        <span>Total sin descuento</span>
                        <span style={{ textDecoration: 'line-through', color: '#888' }}>USD {purchasedTotal.toFixed(2)}</span>
                      </div>
                      <div className="summary-line">
                        <span>Descuento</span>
                        <span>-{discount}%</span>
                      </div>
                      <div className="summary-line total">
                        <span>Total pagado</span>
                        <span>USD {purchasedTotalWithDiscount.toFixed(2)}</span>
                      </div>
                    </>
                  ) : (
                    <div className="summary-line total">
                      <span>Total pagado</span>
                      <span>USD {purchasedTotal.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="cart-checkout-btn" onClick={() => setShowSuccess(false)}>
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Exportación por defecto del componente
export default Cart;
