/**
 * Componente PasswordStrength
 * 
 * Este componente muestra visualmente la fortaleza de una contraseña
 * y los requisitos que debe cumplir. Incluye una barra de progreso
 * con colores que indican el nivel de seguridad y una lista de
 * validaciones con checkmarks.
 */

import './PasswordStrength.css';

/**
 * Componente funcional que renderiza el indicador de fortaleza de contraseña
 * 
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.passwordInfo - Información sobre la contraseña (fortaleza, requisitos, mensaje)
 * @param {boolean} props.mostrar - Controla si el componente debe mostrarse o no
 * @returns {JSX.Element|null} - Elemento JSX del indicador o null si no debe mostrarse
 */
const PasswordStrength = ({ passwordInfo, mostrar }) => {
  // Si no debe mostrarse o no hay información de contraseña, no renderizar nada
  if (!mostrar || !passwordInfo) return null;

  // Destructurar la información de la contraseña
  const { fortaleza, requisitos } = passwordInfo;

  return (
    <div className="password-strength">
      {/* Indicador visual de la fortaleza de la contraseña */}
      <div className="strength-indicator">
        {/* Barra de progreso que cambia de color según la fortaleza */}
        <div className={`strength-bar strength-${fortaleza}`}></div>
        {/* Texto descriptivo del nivel de fortaleza */}
        <span className={`strength-text strength-${fortaleza}`}>
          {passwordInfo.mensaje}
        </span>
      </div>
      
      {/* Lista de requisitos de la contraseña */}
      <ul className="requirements-list">
        {/* Mapear cada requisito y mostrar su estado */}
        {Object.entries(requisitos).map(([key, req]) => (
          <li key={key} className={`requirement ${req.cumple ? 'cumple' : 'no-cumple'}`}>
            {/* Ícono de check o cruz según si cumple el requisito */}
            <span className="check-icon">{req.cumple ? '✓' : '✗'}</span>
            {/* Texto del requisito */}
            {req.texto}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordStrength;
