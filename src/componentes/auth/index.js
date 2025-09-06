/**
 * Archivo de índice para los componentes de autenticación
 * 
 * Este archivo sirve como punto de entrada centralizado para exportar
 * todos los componentes relacionados con la autenticación de usuarios.
 * Permite importar múltiples componentes desde un solo lugar.
 * 
 * Ejemplo de uso:
 * import { InicioSesion, Registro } from './componentes/auth';
 */

// Exporta el componente de inicio de sesión desde su archivo específico
export { default as InicioSesion } from './InicioSesion';

// Exporta el componente de registro desde su archivo específico
export { default as Registro } from './Registro';
