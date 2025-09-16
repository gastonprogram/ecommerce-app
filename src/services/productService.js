/**
 * Servicio para operaciones con productos
 */
import axios from "axios";

// Base URL para la API
const API_BASE = "http://localhost:3000";

/**
 * Cargar datos iniciales (productos y categorías)
 */
export const loadInitialData = async () => {
  const [productsRes, categoriesRes] = await Promise.all([
    axios.get(`${API_BASE}/products`),
    axios.get(`${API_BASE}/categories`)
  ]);

  return {
    products: productsRes.data,
    categories: categoriesRes.data
  };
};

/**
 * Crear un nuevo producto
 */
export const createProduct = async (productData) => {
  const response = await axios.post(`${API_BASE}/products`, productData);
  return response.data;
};

/**
 * Actualizar un producto existente
 */
export const updateProduct = async (productId, productData) => {
  const response = await axios.put(`${API_BASE}/products/${productId}`, productData);
  return response.data;
};

/**
 * Eliminar un producto
 */
export const deleteProduct = async (productId) => {
  await axios.delete(`${API_BASE}/products/${productId}`);
};