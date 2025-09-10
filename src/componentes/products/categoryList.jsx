/**
 * CategoryList.jsx - Componente de navegación lateral de categorías
 * 
 * Muestra una lista de todas las categorías disponibles como navegación lateral,
 * incluyendo un enlace para mostrar todos los productos.
 */

import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

/**
 * Componente de lista de categorías para navegación lateral
 * 
 * @returns {JSX.Element} Barra lateral con enlaces de categorías
 */
export default function CategoryList() {
  // Estados del componente
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Hook para obtener la ruta actual
  const location = useLocation();

  /**
   * Cargar categorías desde la API
   */
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:3000/categories");
        
        if (response.ok) {
          const categoriesData = await response.json();
          setCategories(categoriesData);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  /**
   * Verificar si una ruta está activa
   * 
   * @param {string} path - Ruta a verificar
   * @returns {boolean} True si la ruta está activa
   */
  const isActiveRoute = (path) => {
    return location.pathname === path;
  };

  return (
    <aside className="sidebar">
      <div className="widget">
        <h4>Categorías</h4>
        
        {loading ? (
          <p>Cargando categorías...</p>
        ) : (
          <ul className="category-list">
            {/* Enlace para todos los productos */}
            <li>
              <Link 
                to="/" 
                className={isActiveRoute('/') ? 'active' : ''}
              >
                📦 Todos los productos
              </Link>
            </li>
            
            {/* Enlaces de categorías específicas */}
            {categories.map((category) => (
              <li key={category.id}>
                <Link 
                  to={`/categories/${category.id}`}
                  className={isActiveRoute(`/categories/${category.id}`) ? 'active' : ''}
                >
                  🏷️ {category.name}
                </Link>
              </li>
            ))}
            
            {categories.length === 0 && (
              <li>
                <span className="no-categories">No hay categorías disponibles</span>
              </li>
            )}
          </ul>
        )}
      </div>
    </aside>
  );
}
