import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../features/products/productsSlice";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";

function Home() {
  const dispatch = useDispatch();
  const { items, categories, status, error } = useSelector(
    (state) => state.products
  );

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("none");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchProducts());
    }
  }, [status, dispatch]);

  const filteredProducts = useMemo(() => {
    let result = items.filter((p) =>
      p.title.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }
    if (sort === "low") {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === "high") {
      result = [...result].sort((a, b) => b.price - a.price);
    }
    return result;
  }, [items, search, category, sort]);

  const showMessage = (title) => {
    setMessage(`"${title}" added to cart!`);
    setTimeout(() => setMessage(""), 2000);
  };

  if (status === "loading" || status === "idle") return <Loader />;

  if (status === "failed") {
    return (
      <div className="message error">
        <p>Error: {error}</p>
        <button className="btn" onClick={() => dispatch(fetchProducts())}>
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Products</h1>

      <div className="filters">
        <input
          type="text"
          placeholder="Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="none">Sort by Price</option>
          <option value="low">Low to High</option>
          <option value="high">High to Low</option>
        </select>
      </div>

      {message && <div className="toast">{message}</div>}

      {filteredProducts.length === 0 ? (
        <p className="message">No products found.</p>
      ) : (
        <div className="grid">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdded={showMessage}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;
