import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

function ProductCard({ product, onAdded }) {
  const dispatch = useDispatch();

  const handleAdd = () => {
    dispatch(addToCart(product));
    if (onAdded) onAdded(product.title);
  };

  return (
    <div className="card">
      <Link to={`/product/${product.id}`} className="card-image">
        <img src={product.image} alt={product.title} />
      </Link>
      <div className="card-body">
        <span className="category">{product.category}</span>
        <Link to={`/product/${product.id}`} className="card-title">
          {product.title}
        </Link>
        <p className="price">${product.price.toFixed(2)}</p>
        <button className="btn" onClick={handleAdd}>
          Add to Cart
        </button>
      </div>
    </div>
  );
}

export default ProductCard;
