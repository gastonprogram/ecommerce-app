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

/**
 * Obtener un producto por ID
 */
export const getProductById = async (productId) => {
  const response = await axios.get(`${API_BASE}/products/${productId}`);
  return response.data;
};

/**
 * Actualizar solo el stock de un producto (PATCH)
 */
export const updateProductStock = async (productId, newStock) => {
  const response = await axios.patch(`${API_BASE}/products/${productId}`, { stock: newStock });
  return response.data;
};

/**
 * Checkout: valida stock y descuenta por cada ítem del carrito
 * @param {Array<{id: string|number, quantity: number}>} cartItems
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const checkoutWithStock = async (cartItems) => {
  // Validación previa: obtener y chequear stock actual de todos los productos
  const products = await Promise.all(
    cartItems.map((item) => getProductById(item.id))
  );

  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const product = products[i];
    if (!product) {
      return { success: false, message: `Producto ${item.id} no encontrado.` };
    }
    if (Number(product.stock) < Number(item.quantity)) {
      return {
        success: false,
        message: `Stock insuficiente para "${product.name}". Disponible: ${product.stock}, solicitado: ${item.quantity}.`,
      };
    }
  }

  // Descontar stock (secuencial para mantener orden y simplicidad con json-server)
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const product = products[i];
    const newStock = Number(product.stock) - Number(item.quantity);
    await updateProductStock(item.id, newStock);
  }

  return { success: true, message: "Compra realizada con éxito. Stock actualizado." };
};
