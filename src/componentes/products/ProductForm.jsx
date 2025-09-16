/**
 * Componente del formulario de productos
 */

export default function ProductForm({ 
  editingProduct,
  formData,
  categories,
  handleInputChange,
  handleImageChange,
  handleSubmit,
  resetForm,
  submitting 
}) {
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
              <label htmlFor="categoryId" className="form-label">Categoría *</label>
              <select
                id="categoryId"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleInputChange}
                className="form-input"
                required
              >
                <option value="">Seleccionar categoría</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
            <label htmlFor="image" className="form-label">Imagen</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className="form-input"
              accept="image/*"
            />
            {formData.image && (
              <small className="form-help">
                Archivo seleccionado: {formData.image}
              </small>
            )}
            <small className="form-help">
              Selecciona una imagen para el producto (JPG, PNG, etc.)
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