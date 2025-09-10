/**
 * ProductCrud.jsx - Página de administración de productos
 * 
 * Permite crear, leer, actualizar y eliminar productos.
 * Incluye formulario de producto, lista de productos y funcionalidades de gestión.
 * 
 * Campos del producto:
 * - id (generado automáticamente)
 * - name
 * - categoryId
 * - price
 * - stock
 * - image
 * - description
 */

import { useState, useEffect } from "react";
import axios from "axios";
import "./ProductCrud.css";

/**
 * Componente principal del CRUD de productos
 * 
 * @returns {JSX.Element} Página completa del CRUD de productos
 */
export default function ProductCrud() {
  // Estados para productos y categorías
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Estados para el formulario
  const [editingProduct, setEditingProduct] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    price: "",
    stock: "",
    image: "",
    description: ""
  });

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  // Base URL para la API
  const API_BASE = "http://localhost:3000";

  /**
   * Cargar productos y categorías al inicializar el componente
   */
  useEffect(() => {
    loadInitialData();
  }, []);

  /**
   * Cargar datos iniciales (productos y categorías)
   */
  const loadInitialData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [productsRes, categoriesRes] = await Promise.all([
        axios.get(`${API_BASE}/products`),
        axios.get(`${API_BASE}/categories`)
      ]);

      setProducts(productsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      setError("Error al cargar los datos: " + err.message);
      console.error("Error loading data:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Limpiar formulario y resetear estados
   */
  const resetForm = () => {
    setFormData({
      name: "",
      categoryId: "",
      price: "",
      stock: "",
      image: "",
      description: ""
    });
    setEditingProduct(null);
    setIsCreating(false);
    setError(null);
    setSuccess("");
  };

  /**
   * Manejar cambios en los campos del formulario
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  /**
   * Validar los datos del formulario
   */
  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) errors.push("El nombre es requerido");
    if (!formData.categoryId) errors.push("La categoría es requerida");
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.push("El precio debe ser un número mayor a 0");
    }
    if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) {
      errors.push("El stock debe ser un número mayor o igual a 0");
    }
    if (!formData.description.trim()) errors.push("La descripción es requerida");

    if (errors.length > 0) {
      setError(errors.join(". "));
      return false;
    }

    return true;
  };

  /**
   * Crear un nuevo producto
   */
  const handleCreate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      // Generar ID secuencial: encontrar el ID más alto y sumar 1
      const maxId = products.length > 0 
        ? Math.max(...products.map(p => Number(p.id) || 0))
        : 0;
      const newId = String(maxId + 1);
      
      const productData = {
        id: newId,
        name: formData.name.trim(),
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image.trim(),
        description: formData.description.trim()
      };

      const response = await axios.post(`${API_BASE}/products`, productData);
      
      setProducts(prev => [...prev, response.data]);
      setSuccess("Producto creado exitosamente");
      resetForm();
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      setError("Error al crear el producto: " + err.message);
      console.error("Error creating product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Actualizar un producto existente
   */
  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      setError(null);

      const productData = {
        id: editingProduct.id,
        name: formData.name.trim(),
        categoryId: Number(formData.categoryId),
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image.trim(),
        description: formData.description.trim()
      };

      const response = await axios.put(`${API_BASE}/products/${editingProduct.id}`, productData);
      
      setProducts(prev => 
        prev.map(product => 
          product.id === editingProduct.id ? response.data : product
        )
      );
      
      setSuccess("Producto actualizado exitosamente");
      resetForm();
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      setError("Error al actualizar el producto: " + err.message);
      console.error("Error updating product:", err);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Eliminar un producto
   */
  const handleDelete = async (productId) => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar este producto?")) {
      return;
    }

    try {
      setError(null);
      
      await axios.delete(`${API_BASE}/products/${productId}`);
      
      setProducts(prev => prev.filter(product => product.id !== productId));
      setSuccess("Producto eliminado exitosamente");
      
      // Si estábamos editando el producto eliminado, resetear el formulario
      if (editingProduct && editingProduct.id === productId) {
        resetForm();
      }
      
      // Limpiar mensaje de éxito después de 3 segundos
      setTimeout(() => setSuccess(""), 3000);
      
    } catch (err) {
      setError("Error al eliminar el producto: " + err.message);
      console.error("Error deleting product:", err);
    }
  };

  /**
   * Iniciar edición de un producto
   */
  const startEdit = (product) => {
    setEditingProduct(product);
    setIsCreating(false);
    setFormData({
      name: product.name,
      categoryId: String(product.categoryId),
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || "",
      description: product.description
    });
    setError(null);
    setSuccess("");
  };

  /**
   * Iniciar creación de un nuevo producto
   */
  const startCreate = () => {
    resetForm();
    setIsCreating(true);
  };

  /**
   * Obtener el nombre de la categoría por ID
   */
  const getCategoryName = (categoryId) => {
    const category = categories.find(cat => cat.id === String(categoryId));
    return category ? category.name : "Sin categoría";
  };

  // Mostrar loading
  if (loading) {
    return (
      <div className="product-crud-page">
        <div className="loading">Cargando datos...</div>
      </div>
    );
  }

  return (
    <div className="product-crud-page">
      <div className="crud-header">
        <h1>Administración de Productos</h1>
        <button 
          onClick={startCreate} 
          className="btn btn-primary"
          disabled={submitting}
        >
          + Nuevo Producto
        </button>
      </div>

      {/* Mensajes de estado */}
      {error && <div className="mensaje error">{error}</div>}
      {success && <div className="mensaje success">{success}</div>}

      <div className="crud-layout">
        {/* Formulario */}
        {(isCreating || editingProduct) && (
          <div className="crud-form-section">
            <div className="form-card">
              <h2>{editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}</h2>
              
              <form 
                onSubmit={editingProduct ? handleUpdate : handleCreate}
                className="product-form"
              >
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name" className="form-label">Nombre *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="Ingrese el nombre del producto"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="categoryId" className="form-label">Categoría *</label>
                    <select
                      id="categoryId"
                      name="categoryId"
                      value={formData.categoryId}
                      onChange={handleInputChange}
                      className="form-input"
                      required
                    >
                      <option value="">Seleccionar categoría</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="price" className="form-label">Precio *</label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="stock" className="form-label">Stock *</label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleInputChange}
                      className="form-input"
                      placeholder="0"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="image" className="form-label">Imagen</label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="nombre-imagen.jpg (ej: laptop.jpg)"
                  />
                  <small className="form-help">
                    Nombre del archivo de imagen (debe estar en /public/assets/)
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="description" className="form-label">Descripción *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Descripción detallada del producto"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="btn btn-secondary"
                    disabled={submitting}
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={submitting}
                  >
                    {submitting ? "Guardando..." : (editingProduct ? "Actualizar" : "Crear")}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Lista de productos */}
        <div className="crud-list-section">
          <h2>Productos Existentes ({products.length})</h2>
          
          {products.length === 0 ? (
            <div className="empty-state">
              <p>No hay productos registrados</p>
              <button onClick={startCreate} className="btn btn-primary">
                Crear primer producto
              </button>
            </div>
          ) : (
            <div className="products-table-container">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio</th>
                    <th>Stock</th>
                    <th>Imagen</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr 
                      key={product.id} 
                      className={editingProduct?.id === product.id ? "editing" : ""}
                    >
                      <td>{product.id}</td>
                      <td className="product-name">
                        <strong>{product.name}</strong>
                        <small>{product.description}</small>
                      </td>
                      <td>{getCategoryName(product.categoryId)}</td>
                      <td className="price">${Number(product.price).toFixed(2)}</td>
                      <td className={`stock ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
                        {product.stock} unidades
                      </td>
                      <td className="image-cell">
                        {product.image ? (
                          <img 
                            src={`/assets/${product.image}`} 
                            alt={product.name}
                            className="product-thumbnail"
                          />
                        ) : (
                          <span className="no-image">Sin imagen</span>
                        )}
                      </td>
                      <td className="actions">
                        <button
                          onClick={() => startEdit(product)}
                          className="btn btn-sm btn-secondary"
                          disabled={submitting}
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="btn btn-sm btn-danger"
                          disabled={submitting}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
