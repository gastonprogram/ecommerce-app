/**
 * ProductDetail.jsx - Página de detalle de producto
 * 
 * Muestra la información completa de un producto específico,
 * incluyendo descripción detallada, precio, stock y opciones de compra.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartProvider";

/**
 * Componente de página de detalle de producto
 * 
 * @returns {JSX.Element} Página de detalle del producto
 */
export default function ProductDetail() {
  // Hooks de React Router
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Estados del componente
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Hook del carrito
  const { addToCart } = useCart();

  /**
   * Cargar datos del producto desde la API
   */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/products/${id}`);
        
        if (response.ok) {
          const productData = await response.json();
          setProduct(productData);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error('Error al cargar el producto:', error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  /**
   * Manejar agregar producto al carrito
   */
  const handleAddToCart = () => {
    if (product && product.stock > 0) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
      });
      
      // Feedback visual
      alert(`${product.name} agregado al carrito!`);
    }
  };

  // Estados de carga
  if (loading) return <p>Cargando...</p>;
  if (product === null) return <p>Producto no encontrado</p>;

  // URL de imagen con fallback
  const imgSrc = product.image ? `/assets/${product.image}` : "https://via.placeholder.com/800x500";

  return (
    <div className="product-detail">
      <button 
        onClick={() => navigate(-1)} 
        className="btn btn-secondary back-button"
      >
        ← Volver
      </button>
      
      <div className="product-detail-content">
        <div className="product-image-section">
          <img src={imgSrc} alt={product.name} className="product-image" />
        </div>
        
        <div className="product-info-section">
          <div className="product-category">Producto</div>
          <h1>{product.name}</h1>
          <div className="detail-price">USD {Number(product.price).toFixed(2)}</div>
          
          <div className={`product-stock ${product.stock > 0 ? "stock-available" : "stock-unavailable"}`}>
            {product.stock > 0 ? `${product.stock} disponibles` : "Sin stock"}
          </div>
          
          {product.description && (
            <div className="product-description">
              <h3>Descripción</h3>
              <p>{product.description}</p>
            </div>
          )}
          
          <div className="purchase-section">
            <button
              className="btn btn-primary"
              disabled={product.stock === 0}
              onClick={handleAddToCart}
              title={product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
              style={{ width: '100%', padding: '12px 24px', fontSize: '1.1rem' }}
            >
              {product.stock === 0 ? "Sin stock" : "🛒 Agregar al carrito"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
