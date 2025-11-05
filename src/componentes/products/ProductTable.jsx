/**
 * Componente de la tabla de productos
 */

export default function ProductTable({ 
  products,
  categories,
  editingProduct,
  submitting,
  startEdit,
  handleDelete,
  startCreate,
  getCategoryName 
}) {
  return (
    <div className="crud-list-section">
      <h2>Productos Existentes ({products?.length})</h2>
      
      {products?.length === 0 ? (
        <div className="empty-state">
          <p>No hay productos registrados</p>
          <button onClick={startCreate} className="btn btn-primary">
            Crear primer producto
          </button>
        </div>
      ) : (
        <div className="products-table-container">
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Categoría</th>
                <th>Precio</th>
                <th>Stock</th>
                <th>Imagen</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {products?.map(product => (
                <tr 
                  key={product.id} 
                  className={editingProduct?.id === product.id ? "editing" : ""}
                >
                  <td>{product.id}</td>
                  <td className="product-name">
                    <strong>{product.name}</strong>
                    <small>{product.description}</small>
                  </td>
                  <td>{getCategoryName(product)}</td>
                  <td className="price">${Number(product.price).toFixed(2)}</td>
                  <td className={`stock ${product.stock > 0 ? "in-stock" : "out-stock"}`}>
                    {product.stock} unidades
                  </td>
                  <td className="image-cell">
                    {product.image ? (
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="product-thumbnail"
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.parentElement.innerHTML = '<span class="no-image">Error al cargar</span>';
                        }}
                      />
                    ) : (
                      <span className="no-image">Sin imagen</span>
                    )}
                  </td>
                  <td className="actions">
                    <button
                      onClick={() => startEdit(product)}
                      className="btn btn-sm btn-secondary"
                      disabled={submitting}
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="btn btn-sm btn-danger"
                      disabled={submitting}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}