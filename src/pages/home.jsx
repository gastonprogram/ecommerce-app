import { useEffect, useState } from "react";
import ProductCard from "../components/ProductCard";
import CategoryList from "../components/CategoryList";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:3000/products")
      .then((r) => r.json())
      .then((data) => {
        const sorted = data.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(sorted);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="layout">
      <CategoryList />
      <section className="content">
        <div className="toolbar">
          <h2>Todos los productos</h2>
          <div className="search">
            <input placeholder="Buscar..." value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
        </div>

        {loading ? (
          <p>Cargando productos...</p>
        ) : (
          <div className="grid">
            {filtered.length === 0 && <p>No hay productos.</p>}
            {filtered.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
