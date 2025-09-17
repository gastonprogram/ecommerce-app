import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../componentes/cart/CartProvider";
import { updateProduct } from "../services/productService";

/**
 * Checkout.jsx
 * - Muestra resumen del carrito
 * - Confirma compra
 * - Resta stock en JSON Server
 * - Vacía el carrito
 * - Feedback y redirect
 */

const API_BASE = "http://localhost:3000";

export default function Checkout() {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart(); // requiere clearCart en el provider (abajo te dejo cómo agregarlo)
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Total calculado
  const total = useMemo(
    () =>
      Array.isArray(cart)
        ? cart.reduce((acc, item) => acc + (item.price || 0) * (item.quantity || 0), 0)
        : 0,
    [cart]
  );

  // Si no hay carrito, redirigir
  useEffect(() => {
    if (!cart || cart.length === 0) {
      navigate("/cart");
    }
  }, [cart, navigate]);

  // Obtiene producto actual desde API (asegura stock fresco)
  const fetchProduct = async (id) => {
    const res = await fetch(`${API_BASE}/products/${id}`);
    if (!res.ok) throw new Error("No se pudo obtener el producto " + id);
    return await res.json();
  };

  const handleConfirmPurchase = async () => {
    try {
      setSubmitting(true);
      setError("");
      setSuccess("");

      // 1) Traer stock actual y preparar updates
      const updates = [];
      for (const item of cart) {
        const current = await fetchProduct(item.id);
        const newStock = Math.max((current.stock ?? 0) - (item.quantity || 0), 0);

        // Armamos el payload completo que espera json-server (PUT)
        const payload = { ...current, stock: newStock };

        // 2) Programar update (updateProduct usa PUT /products/:id)
        updates.push(updateProduct(item.id, payload));
      }

      // 3) Ejecutar todas las actualizaciones
      await Promise.all(updates);

      // 4) Vaciar carrito
      if (typeof clearCart === "function") {
        clearCart();
      }

      // 5) Feedback y redirección
      setSuccess("¡Compra realizada con éxito! Gracias por tu pedido.");
      setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      setError(
        err?.message || "Ocurrió un error al procesar tu compra. Intenta nuevamente."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="checkout-page container" style={{ maxWidth: 900, margin: "20px auto" }}>
      <h1>Finalizar compra</h1>

      {error && (
        <div style={{ background: "#fee2e2", color: "#991b1b", padding: "10px 14px", borderRadius: 8, marginBottom: 12 }}>
          {error}
        </div>
      )}
      {success && (
        <div style={{ background: "#dcfce7", color: "#166534", padding: "10px 14px", borderRadius: 8, marginBottom: 12 }}>
          {success} Redirigiendo al inicio…
        </div>
      )}

      {/* Resumen de compra */}
      <div style={{ background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 16, marginBottom: 16 }}>
        <h2 style={{ marginTop: 0 }}>Resumen</h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {cart?.map((item) => (
            <li key={item.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #f3f3f3" }}>
              {item.image && (
                <img
                  src={item.image.startsWith("http") ? item.image : `/assets/${item.image}`}
                  alt={item.name}
                  style={{ width: 64, height: 64, objectFit: "cover", borderRadius: 8, border: "1px solid #eee" }}
                />
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600 }}>{item.name}</div>
                <div style={{ fontSize: 13, color: "#666" }}>
                  Cant: {item.quantity} &nbsp;•&nbsp; $ {Number(item.price).toFixed(2)}
                </div>
              </div>
              <div style={{ fontWeight: 700 }}>$ {(Number(item.price) * Number(item.quantity)).toFixed(2)}</div>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 14 }}>
          <strong>Total</strong>
          <strong>$ {total.toFixed(2)}</strong>
        </div>
      </div>

      {/* Acciones */}
      <div style={{ display: "flex", gap: 12 }}>
        <button
          onClick={() => navigate("/cart")}
          disabled={submitting}
          style={{ padding: "10px 14px", borderRadius: 10, border: "1px solid #e5e7eb", background: "#fff", cursor: "pointer" }}
        >
          Volver al carrito
        </button>
        <button
          onClick={handleConfirmPurchase}
          disabled={submitting}
          style={{ padding: "10px 14px", borderRadius: 10, background: "#10b981", color: "#fff", border: "1px solid #0ea5a4", cursor: "pointer" }}
        >
          {submitting ? "Procesando..." : "Confirmar compra"}
        </button>
      </div>
    </div>
  );
}
