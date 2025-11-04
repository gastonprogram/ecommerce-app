/**
 * Validaciones para los formularios de productos
 */

/**
 * Validar los datos del formulario de producto
 */
export const validateForm = (formData) => {
  const errors = [];

  if (!formData.name.trim()) errors.push("El nombre es requerido");
  // Support multiple categories: require at least one selected
  if (!formData.categorias || !Array.isArray(formData.categorias) || formData.categorias.length === 0) errors.push("La categoría es requerida");
  if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
    errors.push("El precio debe ser un número mayor a 0");
  }
  if (!formData.stock || isNaN(formData.stock) || Number(formData.stock) < 0) {
    errors.push("El stock debe ser un número mayor o igual a 0");
  }
  if (!formData.description.trim()) errors.push("La descripción es requerida");

  if (errors.length > 0) {
    return {
      valid: false,
      message: errors.join(". ")
    };
  }

  return {
    valid: true,
    message: ""
  };
};