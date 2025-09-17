// src/services/productService.js
import axios from "axios";

export const API_BASE = "http://localhost:3000";

// ---------- Productos (CRUD + carga inicial) ----------
export async function loadInitialData() {
  const [productsRes, categoriesRes] = await Promise.all([
    axios.get(`${API_BASE}/products`),
    axios.get(`${API_BASE}/categories`),
  ]);
  return {
    products: productsRes.data || [],
    categories: categoriesRes.data || [],
  };
}

export async function getProducts() {
  const res = await axios.get(`${API_BASE}/products`);
  return res.data;
}

export async function getProduct(id) {
  const res = await axios.get(`${API_BASE}/products/${id}`);
  return res.data;
}

export async function createProduct(product) {
  // json-server asigna id si no se lo pasás; acá respetamos tu generación secuencial si viene
  const res = await axios.post(`${API_BASE}/products`, product);
  return res.data;
}

export async function updateProduct(id, product) {
  // PUT con el objeto completo para json-server
  const res = await axios.put(`${API_BASE}/products/${id}`, product);
  return res.data;
}

export async function deleteProduct(id) {
  const res = await axios.delete(`${API_BASE}/products/${id}`);
  return res.data;
}

// ---------- Checkout con validación de stock y descuento de inventario ----------
/**
 * checkoutWithStock
 * @param {Array<{id: string|number, quantity: number}>} items
 * @returns {Promise<{success: boolean, message?: string}>}
 *
 * Flujo:
 * 1) Trae cada producto "fresco" del servidor.
 * 2) Valida que haya stock suficiente para cada item.
 * 3) Si todo ok, descuenta stock con PUT en paralelo.
 */
export async function checkoutWithStock(items) {
  try {
    if (!Array.isArray(items) || items.length === 0) {
      return { success: false, message: "El carrito está vacío." };
    }

    // 1) Obtener estado actual de cada producto
    const products = await Promise.all(
      items.map(async ({ id }) => {
        const res = await axios.get(`${API_BASE}/products/${id}`);
        return res.data;
      })
    );

    // 2) Validar stock
    for (const { id, quantity } of items) {
      const product = products.find((p) => String(p.id) === String(id));
      if (!product) {
        return { success: false, message: `Producto ${id} no encontrado.` };
      }
      const currentStock = Number(product.stock ?? 0);
      const wanted = Number(quantity ?? 0);

      if (wanted <= 0) {
        return { success: false, message: "Cantidad inválida en el carrito." };
      }
      if (currentStock < wanted) {
        return {
          success: false,
          message: `Stock insuficiente para "${product.name}". Disponible: ${currentStock}, solicitado: ${wanted}.`,
        };
      }
    }

    // 3) Descontar stock (PUT con objeto completo que espera json-server)
    await Promise.all(
      items.map(async ({ id, quantity }) => {
        const current = products.find((p) => String(p.id) === String(id));
        const newStock = Math.max(Number(current.stock ?? 0) - Number(quantity ?? 0), 0);
        const payload = { ...current, stock: newStock };
        await axios.put(`${API_BASE}/products/${id}`, payload);
      })
    );

    return { success: true };
  } catch (err) {
    console.error("checkoutWithStock error:", err?.response?.data || err?.message || err);
    return {
      success: false,
      message:
        err?.response?.data?.message ||
        err?.message ||
        "Error al procesar la compra. Intenta nuevamente.",
    };
  }
}
