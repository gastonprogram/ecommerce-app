import { Link } from "react-router-dom";

export default function ProductCard({ product }) {
  const imgSrc = product.image ? `/assets/${product.image}` : "https://via.placeholder.com/400x240";

  return (
    <article className="product-card">
      <div className="product-thumb">
        <img src={imgSrc} alt={product.name} />
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <p className="product-desc">{product.shortDescription || ""}</p>
        <p className="product-price">USD {Number(product.price).toFixed(2)}</p>
        <div className="product-footer">
          <span className={`stock ${product.stock > 0 ? "in" : "out"}`}>
            {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
          </span>
          <Link to={`/product/${product.id}`} className="btn btn-primary">Ver detalles</Link>
        </div>
      </div>
    </article>
  );
}
