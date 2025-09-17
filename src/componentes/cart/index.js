/**
 * Archivo de índice para los componentes del carrito
 *
 * Este archivo sirve como punto de entrada centralizado para exportar
 * todos los componentes relacionados con el carrito de compras.
 * Permite importar múltiples componentes desde un solo lugar.
 * 
 * Ejemplo de uso:
 * import { Cart } from './componentes/cart';
 */

export { default as Cart } from './Cart';
export { default as CartProvider } from '../../context/CartProvider';
export { useCart } from '../../context/CartProvider';
