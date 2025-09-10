/**
 * ProductCard.jsx - Componente para mostrar tarjeta de producto
 * 
 * Muestra la información básica de un producto en formato de tarjeta,
 * incluyendo imagen, nombre, precio, stock y botones de acción.
 */

import { Link } from "react-router-dom";
import { useCart } from "../cart/CartProvider";

/**
 * Componente de tarjeta de producto
 * 
 * @param {Object} props - Props del componente
 * @param {Object} props.product - Datos del producto
 * @returns {JSX.Element} Tarjeta de producto
 */
export default function ProductCard({ product }) {
  // Hook para acceder a las funciones del carrito
  const { addToCart } = useCart();

  // URL de imagen con fallback
  const imgSrc = product.image ? `/assets/${product.image}` : "https://via.placeholder.com/400x240";

  /**
   * Manejar agregar producto al carrito
   */
  const handleAddToCart = () => {
    // Solo agregar si hay stock disponible
    if (product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
      
      console.log(`${product.name} agregado al carrito!`);
    }
  };

  return (
    <article className="product-card">
      <div className="product-thumb">
        <img src={imgSrc} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.shortDescription || product.description || ""}</p>
        <p className="product-price">USD {Number(product.price).toFixed(2)}</p>
        <div className="product-footer">
          <span className={`stock ${product.stock > 0 ? "in" : "out"}`}>
            {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
          </span>
          <div className="product-actions">
            <Link to={`/product/${product.id}`} className="btn btn-secondary">
              Ver detalles
            </Link>
            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="btn btn-primary"
              title={product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
            >
              {product.stock === 0 ? "Sin stock" : "🛒 Agregar"}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
