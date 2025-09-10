import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import CategoryList from "../components/CategoryList";

export default function Categories() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`http://localhost:3000/products?categoryId=${id}`)
      .then((r) => r.json())
      .then((data) => setProducts(data.sort((a,b)=>a.name.localeCompare(b.name))))
      .catch(()=>setProducts([]))
      .finally(()=>setLoading(false));
  }, [id]);

  return (
    <div className="layout">
      <CategoryList />
      <section className="content">
        <div className="toolbar">
          <h2>Categoría {id}</h2>
        </div>
        {loading ? <p>Cargando...</p> : (
          <div className="grid">
            {products.length === 0 && <p>No hay productos en esta categoría.</p>}
            {products.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>
    </div>
  );
}
