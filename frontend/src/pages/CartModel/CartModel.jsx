// components/Cart/CartModel.jsx
import React from "react";
import "./CartModel.css";
import { useSelector, useDispatch } from "react-redux";
import {
  removeItemFromCart,
  updateCartItemQty,
} from "../../features/cartSlice";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Plus, Minus } from "lucide-react";

function CartModel({ open, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.user);

  if (!open) return null;

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const removeHandler = (id, size) => {
    dispatch(removeItemFromCart({ productId: id, size }));
  };

  const increaseQty = (id, size, qty, stock) => {
    const newQty = qty + 1;
    if (stock && newQty > stock) return;
    dispatch(updateCartItemQty({ productId: id, size, quantity: newQty }));
  };

  const decreaseQty = (id, size, qty) => {
    const newQty = qty - 1;
    if (newQty < 1) return;
    dispatch(updateCartItemQty({ productId: id, size, quantity: newQty }));
  };

  const checkoutHandler = () => {
    onClose();
    if (isAuthenticated) {
      navigate("/shipping");
    } else {
      navigate("/login?redirect=shipping");
    }
  };

  return (
    <div className="cart-overlay" onClick={onClose}>
      <div className="cart-modal" onClick={(e) => e.stopPropagation()}>
        <button className="cart-close" onClick={onClose}>
          ×
        </button>

        <h2 className="cart-title">Your Cart ({cartItems.length})</h2>

        <div className="cart-body">
          {cartItems.length === 0 ? (
            <div className="cart-empty-state">
              <p className="cart-empty-text">No items found.</p>
              <button className="cart-shop-btn-outline" onClick={onClose}>
                Continue Shopping
              </button>
            </div>
          ) : (
            <div className="cart-items-list">
              {cartItems.map((item) => (
                <div
                  key={`${item.product}-${item.size}`}
                  className="cart-item"
                >
                  <div className="cart-item-img">
                    <img src={item.image} alt={item.name} />
                  </div>

                  <div className="cart-item-info">
                    <Link
                      to={`/product/${item.product}`}
                      onClick={onClose}
                      className="cart-item-name"
                    >
                      {item.name}
                    </Link>

                    {/* ⭐ Size + stock text */}
                    <p className="cart-item-meta">
                      Size: {item.size}
                      {item.stock !== undefined && (
                        <span className="cart-item-stock">
                          {" "}
                          (In stock: {item.stock})
                        </span>
                      )}
                    </p>

                    <div className="cart-item-row">
                      <div className="cart-qty-control">
                        <button
                          onClick={() =>
                            decreaseQty(item.product, item.size, item.quantity)
                          }
                        >
                          <Minus size={14} />
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() =>
                            increaseQty(
                              item.product,
                              item.size,
                              item.quantity,
                              item.stock
                            )
                          }
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                      <span className="cart-item-price">
                        ₹{item.price * item.quantity}
                      </span>
                    </div>
                  </div>

                  <button
                    className="cart-remove-btn"
                    onClick={() => removeHandler(item.product, item.size)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Subtotal:</span>
              <span>₹{subtotal}</span>
            </div>
            <button className="cart-shop-btn" onClick={checkoutHandler}>
              PROCEED TO CHECKOUT
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default CartModel;
