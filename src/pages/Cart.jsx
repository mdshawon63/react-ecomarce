import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  removeFromCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} from "../features/cart/cartSlice";

function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((state) => state.cart.items);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleRemove = (item) => {
    // Bonus: confirmation before removing
    if (window.confirm(`Remove "${item.title}" from your cart?`)) {
      dispatch(removeFromCart(item.id));
    }
  };

  if (items.length === 0) {
    return (
      <div className="message">
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added anything yet.</p>
        <Link to="/" className="btn">
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Shopping Cart</h1>

      <div className="cart-list">
        {items.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.title} />
            <div className="cart-info">
              <Link to={`/product/${item.id}`} className="card-title">
                {item.title}
              </Link>
              <p className="price">${item.price.toFixed(2)}</p>
            </div>

            <div className="qty">
              <button onClick={() => dispatch(decreaseQuantity(item.id))}>
                -
              </button>
              <span>{item.quantity}</span>
              <button onClick={() => dispatch(increaseQuantity(item.id))}>
                +
              </button>
            </div>

            <p className="item-total">
              ${(item.price * item.quantity).toFixed(2)}
            </p>

            <button className="btn btn-danger" onClick={() => handleRemove(item)}>
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="summary">
        <h2>Order Summary</h2>
        <div className="summary-row">
          <span>Subtotal</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="summary-row total">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => {
            if (window.confirm("Clear all items from the cart?")) {
              dispatch(clearCart());
            }
          }}
        >
          Clear Cart
        </button>
      </div>
    </div>
  );
}

export default Cart;
