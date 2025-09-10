/**
 * ProductDetail.jsx - Página de detalle de producto
 * 
 * Muestra la información completa de un producto específico,
 * incluyendo descripción detallada, precio, stock y opciones de compra.
 */

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../componentes/cart/CartProvider";

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
        style={{ marginBottom: '1rem' }}
      >
        ← Volver
      </button>
      
      <div className="detail-media">
        <img src={imgSrc} alt={product.name} />
      </div>
      
      <div className="detail-info">
        <h2>{product.name}</h2>
        <p className="detail-price">USD {Number(product.price).toFixed(2)}</p>
        <p className="detail-desc">{product.description || "Sin descripción."}</p>
        <p className={`detail-stock ${product.stock > 0 ? "in" : "out"}`}>
          {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
        </p>
        
        <button
          className="btn btn-primary"
          disabled={product.stock === 0}
          onClick={handleAddToCart}
          title={product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
        >
          {product.stock === 0 ? "Sin stock" : "🛒 Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
