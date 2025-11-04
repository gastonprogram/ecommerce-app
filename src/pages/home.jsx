import { useEffect, useState } from "react";
import ProductCard from "../componentes/products/productCard";
import CategoryList from "../componentes/products/categoryList";
import { loadInitialData } from "../services/productService";

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const { products: prodResp } = await loadInitialData();
        const productArray = Array.isArray(prodResp) ? prodResp : [];
        const sorted = productArray.sort((a, b) => a.name.localeCompare(b.name));
        setProducts(sorted);
      } catch (e) {
        console.error('Error cargando productos:', e);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
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
