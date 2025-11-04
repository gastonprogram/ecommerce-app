/**
 * Categories.jsx - Página de productos por categoría
 * 
 * Muestra todos los productos que pertenecen a una categoría específica,
 * con navegación lateral de categorías y vista de cuadrícula de productos.
 */

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../componentes/products/productCard";
import CategoryList from "../componentes/products/categoryList";
import { getProductsByCategory } from "../services/productService";

/**
 * Componente de página de categorías
 * 
 * @returns {JSX.Element} Página de productos filtrados por categoría
 */
export default function Categories() {
  // Hook para obtener el ID de categoría de la URL
  const { id } = useParams();
  
  // Estados del componente
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /**
   * Cargar productos de la categoría específica
   */
  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const data = await getProductsByCategory(id);
        const arr = Array.isArray(data) ? data : [];
        const sortedProducts = arr.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(sortedProducts);
      } catch (error) {
        console.error('Error al cargar productos de la categoría:', error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategoryProducts();
    }
  }, [id]);

  return (
    <div className="layout">
      {/* Navegación lateral de categorías */}
      <CategoryList />
      
      {/* Contenido principal */}
      <section className="content">
        <div className="toolbar">
          <h2>Categoría {id}</h2>
          {!loading && (
            <span className="category-count">
              {products.length} producto{products.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>
        
        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="grid">
            {products.length === 0 ? (
              <p>No hay productos en esta categoría.</p>
            ) : (
              products.map(product => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
          </div>
        )}
      </section>
    </div>
  );
}
