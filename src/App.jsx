import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Categories from "./pages/categories";
import ProductDetail from "./pages/ProductDetail";
import { CartProvider, useCart } from "./context/cartContext";
import "./index.css";

function Header() {
  const { cart } = useCart();
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link to="/" className="brand">TIENDA ONLINE</Link>
        <nav className="nav">
          <Link to="/">Productos</Link>
        </nav>
        <button className="btn-cart">
          🛒 Carrito <span className="cart-count">{cart.length}</span>
        </button>
      </div>
    </header>
  );
}

export default function App() {
  return (
    <CartProvider>
      <BrowserRouter>
        <Header />
        <main className="site-main container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories/:id" element={<Categories />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
        </main>
      </BrowserRouter>
    </CartProvider>
  );
}
