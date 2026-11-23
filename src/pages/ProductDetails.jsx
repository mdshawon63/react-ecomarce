import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";
import Loader from "../components/Loader";

function ProductDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(`https://fakestoreapi.com/products/${id}`);
        if (!res.ok) throw new Error("Failed to fetch product.");
        const data = await res.json();
        if (!data) throw new Error("Product not found.");
        setProduct(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  const handleAdd = () => {
    dispatch(addToCart(product));
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return <Loader />;
  if (error) {
    return (
      <div className="message error">
        <p>Error: {error}</p>
        <Link to="/" className="btn">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div>
      <Link to="/" className="back-link">
        &larr; Back to products
      </Link>
      <div className="details">
        <div className="details-image">
          <img src={product.image} alt={product.title} />
        </div>
        <div className="details-info">
          <span className="category">{product.category}</span>
          <h1>{product.title}</h1>
          <p className="price big">${product.price.toFixed(2)}</p>
          <p className="description">{product.description}</p>
          <button className="btn" onClick={handleAdd}>
            Add to Cart
          </button>
          {added && <p className="success-text">Added to cart!</p>}
        </div>
      </div>
    </div>
  );
}

export default ProductDetails;
