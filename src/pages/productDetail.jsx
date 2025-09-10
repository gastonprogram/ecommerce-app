import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/cartContext";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    fetch(`http://localhost:3000/products/${id}`)
      .then((r) => r.json())
      .then(setProduct)
      .catch(() => setProduct(null));
  }, [id]);

  if (product === null) return <p>Cargando...</p>;

  const imgSrc = product.image ? `/assets/${product.image}` : "https://via.placeholder.com/800x500";

  return (
    <div className="product-detail">
      <div className="detail-media">
        <img src={imgSrc} alt={product.name} />
      </div>
      <div className="detail-info">
        <h2>{product.name}</h2>
        <p className="detail-price">USD {Number(product.price).toFixed(2)}</p>
        <p className="detail-desc">{product.description || "Sin descripción."}</p>
        <p className={`detail-stock ${product.stock > 0 ? "in" : "out"}`}>
          {product.stock > 0 ? `${product.stock} en stock` : "Sin stock"}
        </p>
        <button
          className="btn btn-primary"
          disabled={product.stock === 0}
          onClick={() => addToCart(product)}
        >
          {product.stock === 0 ? "Sin stock" : "Agregar al carrito"}
        </button>
      </div>
    </div>
  );
}
