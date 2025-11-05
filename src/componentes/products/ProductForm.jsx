/**
 * Componente del formulario de productos
 */

import { useState, useRef, useEffect } from 'react';

export default function ProductForm({ 
  editingProduct,
  formData,
  categories,
  handleInputChange,
  handleSubmit,
  resetForm,
  submitting 
}) {

  function MultiSelect({ options, value = [], onChange, placeholder }) {
    const [open, setOpen] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
      function onDoc(e) {
        if (ref.current && !ref.current.contains(e.target)) setOpen(false);
      }
      document.addEventListener('click', onDoc);
      return () => document.removeEventListener('click', onDoc);
    }, []);

    const toggleOption = (optValue) => {
      const exists = value.includes(String(optValue));
      const next = exists ? value.filter((v) => v !== String(optValue)) : [...value, String(optValue)];
      onChange(next);
    };

    return (
      <div className="multi-select" ref={ref} style={{ position: 'relative' }}>
        <button type="button" className="multi-select-toggle form-input" onClick={() => setOpen((s) => !s)}>
          {value && value.length > 0
            ? value
                .map((id) => {
                  const c = options.find((o) => String(o.id) === String(id));
                  return c ? c.name : id;
                })
                .join(', ')
            : placeholder}
          <span style={{ float: 'right' }}>▾</span>
        </button>

        {open && (
          <div className="multi-select-menu" style={{
            position: 'absolute',
            zIndex: 20,
            background: '#fff',
            border: '1px solid #ddd',
            borderRadius: 6,
            marginTop: 6,
            width: '100%',
            maxHeight: 200,
            overflow: 'auto',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
          }}>
            {options.map((opt) => (
              <label key={opt.id} style={{ display: 'flex', alignItems: 'center', padding: '8px 12px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={value.includes(String(opt.id))}
                  onChange={() => toggleOption(opt.id)}
                  style={{ marginRight: 8 }}
                />
                <span>{opt.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    );
  }
  return (
    <div className="crud-form-section">
      <div className="form-card">
        <h2>{editingProduct ? "Editar Producto" : "Crear Nuevo Producto"}</h2>
        
        <form 
          onSubmit={handleSubmit}
          className="product-form"
        >
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Nombre *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Ingrese el nombre del producto"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="categorias" className="form-label">Categorías *</label>
              <MultiSelect
                options={categories}
                value={formData.categorias || []}
                onChange={(selectedArray) => {
                  // enviar como evento sintético para mantener compatibilidad
                  handleInputChange({ target: { name: 'categorias', value: selectedArray } });
                }}
                placeholder="Seleccionar categorías"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price" className="form-label">Precio *</label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className="form-input"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock" className="form-label">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"
                value={formData.stock}
                onChange={handleInputChange}
                className="form-input"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="image" className="form-label">URL de la Imagen</label>
            <input
              type="url"
              id="image"
              name="image"
              value={formData.image}
              onChange={handleInputChange}
              className="form-input"
              placeholder="https://ejemplo.com/imagen.jpg"
            />
            {formData.image && (
              <div style={{ marginTop: '10px' }}>
                <img 
                  src={formData.image} 
                  alt="Vista previa" 
                  style={{ 
                    maxWidth: '200px', 
                    maxHeight: '200px', 
                    objectFit: 'contain',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '8px'
                  }}
                  onError={(e) => {
                    e.target.style.display = 'none';
                    e.target.nextElementSibling.style.display = 'block';
                  }}
                />
                <small 
                  className="form-help" 
                  style={{ display: 'none', color: '#dc3545' }}
                >
                  ⚠️ No se pudo cargar la imagen. Verifica la URL.
                </small>
              </div>
            )}
            <small className="form-help">
              Ingresa la URL de una imagen desde internet (ej: https://ejemplo.com/imagen.jpg)
            </small>
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">Descripción *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="form-textarea"
              placeholder="Descripción detallada del producto"
              rows="4"
              required
            />
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={resetForm}
              className="btn btn-secondary"
              disabled={submitting}
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={submitting}
            >
              {submitting ? "Guardando..." : (editingProduct ? "Actualizar" : "Crear")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}