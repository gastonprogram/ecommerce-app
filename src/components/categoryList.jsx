import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function CategoryList() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3000/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return (
    <aside className="sidebar">
      <div className="widget">
        <h4>Categorías</h4>
        <ul className="category-list">
          <li><Link to="/">Todos los productos</Link></li>
          {categories.map((c) => (
            <li key={c.id}>
              <Link to={`/categories/${c.id}`}>{c.name}</Link>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}
