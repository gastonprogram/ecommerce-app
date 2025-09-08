
import { useCart } from "./CartProvider";
import { useEffect, useState } from "react";
import "./Cart.css";

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
        console.log(data);
      })
      .catch(() => setProducts([]));
  }, []);


  const getProduct = (id) => products.find((p) => p.id === id);
  const total = cart.reduce((acc, item) => {
    const prod = getProduct(item.id);
    return acc + (prod ? prod.precio * item.quantity : 0);
  }, 0);

  // Función para agregar productos de prueba al carrito
  const { addToCart } = useCart();
  const agregarPrueba = () => {
    // IDs de productos de ejemplo (ajusta según tu db.json)
    const ids = [1, 2, 3];
    ids.forEach((id) => {
      const prod = products.find((p) => p.id === id);
      if (prod) addToCart(prod);
    });
  };


  if (cart.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Tu carrito está vacío</h2>
        <button className="cart-add-demo-btn" onClick={agregarPrueba}>Agregar productos de prueba</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">Carrito de compras</h2>
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
          {cart.map((item) => {
            const prod = getProduct(item.id) || {};
            return (
              <tr key={item.id}>
                <td className="cart-product">
                  <img className="cart-product-img" src={prod.imagen} alt={prod.nombre} />
                  <span>{prod.nombre || "Producto"}</span>
                </td>
                <td>
                  <input
                    className="cart-qty-input"
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={e => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                  />
                </td>
                <td>${prod.precio?.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                <td>${((prod.precio || 0) * item.quantity).toLocaleString("es-AR", { minimumFractionDigits: 2 })}</td>
                <td>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item.id)}>Eliminar</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="cart-actions">
        <h3 className="cart-total">Total: ${total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}</h3>
        <button className="cart-clear-btn" onClick={clearCart}>Vaciar carrito</button>
        <button className="cart-checkout-btn">Finalizar compra</button>
      </div>
    </div>
  );
}

export default Cart;