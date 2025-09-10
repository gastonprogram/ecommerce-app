/**
 * SimpleHeader.jsx - Componente de encabezado simplificado
 * 
 * Este componente muestra únicamente el logo/marca de la tienda
 * para usar en páginas de autenticación (login/registro) donde
 * no se necesita navegación completa.
 * 
 * Características:
 * - Solo muestra el logo/marca "TIENDA ONLINE"
 * - Mantiene los mismos estilos del header principal
 * - Diseño limpio y minimalista
 */

import { Link } from "react-router-dom";

/**
 * Componente de encabezado simplificado
 * 
 * Muestra solo la marca de la tienda sin navegación ni funcionalidades
 * 
 * @returns {JSX.Element} Encabezado simplificado
 */
const SimpleHeader = () => {
  return (
    <header className="site-header">
      <div className="header-inner container simple-header">
        {/* Solo el logo/marca de la tienda */}
        <Link to="/" className="brand">
          TIENDA ONLINE
        </Link>
      </div>
    </header>
  );
};

export default SimpleHeader;
