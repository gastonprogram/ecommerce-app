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
import { ProductForm, ProductTable } from "../componentes/products";
import {
  loadInitialData,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../services/productService";
import { validateForm } from "../utils/validacionesProductos";
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
    categorias: [],
    price: "",
    stock: "",
    image: "",
    description: "",
  });
  // 👉 Auto-scroll cuando se activa la edición
  useEffect(() => {
    if (editingProduct) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [editingProduct]);

  // Estados de UI
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState("");

  /**
   * Cargar productos y categorías al inicializar el componente
   */
  useEffect(() => {
    loadData();
  }, []);

  /**
   * Cargar datos iniciales (productos y categorías)
   */
  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await loadInitialData();
      setProducts(data.products);
      setCategories(data.categories);
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
      categorias: [],
      price: "",
      stock: "",
      image: "",
      description: "",
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
    // Accept either a native event (with options for multi-select) or a synthetic event
    const tgt = e && e.target ? e.target : e;
    const { name } = tgt;

    if (name === "categorias") {
      // If caller passed an array directly: { target: { name: 'categorias', value: [...] } }
      if (Array.isArray(tgt.value)) {
        setFormData((prev) => ({ ...prev, categorias: tgt.value }));
        return;
      }

      // Native select multiple: read options
      if (tgt.options) {
        const selected = Array.from(tgt.options)
          .filter((o) => o.selected)
          .map((o) => o.value);
        setFormData((prev) => ({ ...prev, categorias: selected }));
        return;
      }
    }

    const value = tgt.value;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  /**
   * Validar los datos del formulario
   */
  const validateFormData = () => {
    const validation = validateForm(formData);
    if (!validation.valid) {
      setError(validation.message);
      return false;
    }
    return true;
  };

  /**
   * Crear un nuevo producto
   */
  const handleCreate = async (e) => {
    e.preventDefault();

    if (!validateFormData()) return;

    try {
      setSubmitting(true);
      setError(null);

      // Generar ID secuencial: encontrar el ID más alto y sumar 1
      const maxId =
        products.length > 0
          ? Math.max(...products.map((p) => Number(p.id) || 0))
          : 0;
      const newId = String(maxId + 1);

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image.trim(),
        categoriasIds: (formData.categorias || []).map((id) => Number(id)),
      };

      console.log('Datos enviados al backend:', productData);

      const newProduct = await createProduct(productData);

      setProducts((prev) => [...prev, newProduct]);
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

    if (!validateFormData()) return;

    try {
      setSubmitting(true);
      setError(null);

      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        stock: Number(formData.stock),
        image: formData.image.trim(),
        categoriasIds: (formData.categorias || []).map((id) => Number(id)),
      };

      console.log('Datos actualizados enviados al backend:', productData);

      const updatedProduct = await updateProduct(
        editingProduct.id,
        productData
      );

      setProducts((prev) =>
        prev.map((product) =>
          product.id === editingProduct.id ? updatedProduct : product
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
  const handleDeleteProduct = async (productId) => {
    if (
      !window.confirm("¿Estás seguro de que deseas eliminar este producto?")
    ) {
      return;
    }

    try {
      setError(null);

      await deleteProduct(productId);

      setProducts((prev) => prev.filter((product) => product.id !== productId));
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
      categorias: product.categorias ? product.categorias.map((c) => String(c.id)) : (product.categoryId ? [String(product.categoryId)] : []),
      price: String(product.price),
      stock: String(product.stock),
      image: product.image || "",
      description: product.description,
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
  const getCategoryName = (productOrCategory) => {
    if (!productOrCategory) return "Sin categoría";

    // Si viene un objeto producto
    if (typeof productOrCategory === "object") {
      const prod = productOrCategory;
      const cats = prod.categorias || (prod.categoryId ? [{ id: prod.categoryId }] : []);
      if (!cats || cats.length === 0) return "Sin categoría";
      return cats
        .map((c) => {
          const id = String(typeof c === "object" ? c.id : c);
          const category = categories.find((cat) => String(cat.id) === id);
          return category ? category.name : id;
        })
        .join(", ");
    }

    // Si viene un id o array de ids
    if (Array.isArray(productOrCategory)) {
      return productOrCategory
        .map((id) => {
          const category = categories.find((cat) => String(cat.id) === String(id));
          return category ? category.name : id;
        })
        .join(", ");
    }

    const category = categories.find((cat) => cat.id === String(productOrCategory));
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
          <ProductForm
            editingProduct={editingProduct}
            formData={formData}
            categories={categories}
            handleInputChange={handleInputChange}
            handleSubmit={editingProduct ? handleUpdate : handleCreate}
            resetForm={resetForm}
            submitting={submitting}
          />
        )}

        {/* Lista de productos */}
        <ProductTable
          products={products}
          categories={categories}
          editingProduct={editingProduct}
          submitting={submitting}
          startEdit={startEdit}
          handleDelete={handleDeleteProduct}
          startCreate={startCreate}
          getCategoryName={getCategoryName}
        />
      </div>
    </div>
  );
}
