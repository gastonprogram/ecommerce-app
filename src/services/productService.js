/**
 * Servicio para operaciones con productos (consume el backend Spring Boot)
 * Usa `apiRequest` de `authService` que agrega headers y parsea JSON.
 */
import { apiRequest } from "./authService";

/**
 * Cargar datos iniciales (productos y categorías)
 */
export const loadInitialData = async () => {
  const [productsRes, categoriesRes] = await Promise.all([
    apiRequest("/api/productos", { method: "GET" }),
    apiRequest("/api/categorias", { method: "GET" }),
  ]);

  return {
    products: productsRes || [],
    categories: categoriesRes || [],
  };
};

// Obtener todos los productos
export const getProducts = async () => {
  return await apiRequest("/api/productos", { method: "GET" });
};

// Obtener producto por id
export const getProductById = async (id) => {
  return await apiRequest(`/api/productos/${id}`, { method: "GET" });
};

// Obtener productos por categoría
export const getProductsByCategory = async (categoryId) => {
  return await apiRequest(`/api/productos/categoria/${categoryId}`, { method: "GET" });
};

// Buscar productos por nombre
export const searchProductsByName = async (nombre) => {
  return await apiRequest(`/api/productos/buscar?nombre=${encodeURIComponent(nombre)}`, { method: "GET" });
};

// Obtener productos por usuario
export const getProductsByUser = async (usuarioId) => {
  return await apiRequest(`/api/productos/usuario/${usuarioId}`, { method: "GET" });
};

// Crear producto (requiere autenticación)
export const createProduct = async (productData) => {
  return await apiRequest(`/api/productos`, { method: "POST", body: JSON.stringify(productData) }, true);
};

// Actualizar producto (requiere autenticación)
export const updateProduct = async (productId, productData) => {
  return await apiRequest(`/api/productos/${productId}`, { method: "PUT", body: JSON.stringify(productData) }, true);
};

// Eliminar producto (requiere autenticación)
export const deleteProduct = async (productId) => {
  return await apiRequest(`/api/productos/${productId}`, { method: "DELETE" }, true);
};

// Actualizar stock (PUT /api/productos/{id}/stock?stock={cantidad})
export const updateProductStock = async (productId, newStock) => {
  return await apiRequest(`/api/productos/${productId}/stock?stock=${encodeURIComponent(newStock)}`, { method: "PUT" }, true);
};

// Verificar stock (GET /api/productos/{id}/stock/{cantidad}) -> devuelve Boolean
export const verifyStock = async (productId, cantidad) => {
  return await apiRequest(`/api/productos/${productId}/stock/${encodeURIComponent(cantidad)}`, { method: "GET" });
};

// Agregar categoría a producto
export const addCategoryToProduct = async (productId, categoriaId) => {
  return await apiRequest(`/api/productos/${productId}/categorias/${categoriaId}`, { method: "PUT" }, true);
};

// Quitar categoría de producto
export const removeCategoryFromProduct = async (productId, categoriaId) => {
  return await apiRequest(`/api/productos/${productId}/categorias/${categoriaId}`, { method: "DELETE" }, true);
};

// Checkout: valida stock y descuenta por cada ítem del carrito
export const checkoutWithStock = async (cartItems) => {
  // Validación previa: obtener y chequear stock actual de todos los productos
  const products = await Promise.all(cartItems.map((item) => getProductById(item.id)));

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

  // Descontar stock secuencialmente usando el endpoint de stock
  for (let i = 0; i < cartItems.length; i++) {
    const item = cartItems[i];
    const product = products[i];
    const newStock = Number(product.stock) - Number(item.quantity);
    await updateProductStock(item.id, newStock);
  }

  return { success: true, message: "Compra realizada con éxito. Stock actualizado." };
};

// Crear pedido vía endpoint /api/pedidos/checkout
export const createOrderCheckout = async (cartItems) => {
  // cartItems: [{ id, quantity }] -> DTO espera items: [{ productoId, cantidad }]
  const payload = {
    items: (cartItems || []).map((it) => ({ productoId: it.id, cantidad: it.quantity }))
  };

  // Usamos apiRequest con auth por si el endpoint requiere token
  const result = await apiRequest('/api/pedidos/checkout', {
    method: 'POST',
    body: JSON.stringify(payload)
  }, true);

  return result; // PedidoResponseDTO o lanza error
};
