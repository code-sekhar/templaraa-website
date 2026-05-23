import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";

function Cart({
  cartItems = [],
  onUpdateCartQuantity,
  onRemoveCartItem,
  onClearCart,
}) {
  const navigate = useNavigate();

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState("");
  const [showPromoSuggestion, setShowPromoSuggestion] = useState(true);

  const taxAmount = 2;

  const promoCodes = useMemo(
    () => [
      {
        code: "SAVE10",
        label: "$10 off",
        type: "fixed",
        value: 10,
      },
      {
        code: "TEMPLATE15",
        label: "15% off",
        type: "percent",
        value: 15,
      },
      {
        code: "LAUNCH20",
        label: "20% off",
        type: "percent",
        value: 20,
      },
      {
        code: "UI5",
        label: "$5 off",
        type: "fixed",
        value: 5,
      },
      {
        code: "DIGITAL12",
        label: "12% off",
        type: "percent",
        value: 12,
      },
      {
        code: "CART8",
        label: "$8 off",
        type: "fixed",
        value: 8,
      },
    ],
    []
  );

  const suggestedPromo = useMemo(() => {
    const randomIndex = Math.floor(Math.random() * promoCodes.length);
    return promoCodes[randomIndex];
  }, [promoCodes]);

  useEffect(() => {
    if (!showPromoSuggestion) return undefined;

    const promoTimer = window.setTimeout(() => {
      setShowPromoSuggestion(false);
    }, 30000);

    return () => {
      window.clearTimeout(promoTimer);
    };
  }, [showPromoSuggestion]);

  const cartOriginalSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      const quantity = Number(item.quantity || 1);
      const currentPrice = Number(item.price || 0);
      const discountPercent = Number(
        item.discountPercent || item.discount || 0
      );

      const originalPrice = Number(
        item.oldPrice ||
          (discountPercent > 0
            ? currentPrice / (1 - discountPercent / 100)
            : currentPrice)
      );

      return total + originalPrice * quantity;
    }, 0);
  }, [cartItems]);

  const cartSubtotal = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.price || 0) * Number(item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const cartQuantity = useMemo(() => {
    return cartItems.reduce((total, item) => {
      return total + Number(item.quantity || 1);
    }, 0);
  }, [cartItems]);

  const productDiscountAmount = Math.max(
    0,
    cartOriginalSubtotal - cartSubtotal
  );

  const promoDiscountAmount = useMemo(() => {
    if (!appliedPromo || cartSubtotal <= 0) return 0;

    if (appliedPromo.type === "percent") {
      return (cartSubtotal * Number(appliedPromo.value || 0)) / 100;
    }

    return Math.min(Number(appliedPromo.value || 0), cartSubtotal);
  }, [appliedPromo, cartSubtotal]);

  const cartTotal =
    cartSubtotal > 0
      ? Math.max(0, cartSubtotal + taxAmount - promoDiscountAmount)
      : 0;

  const handleQuantityChange = (productId, type) => {
    if (onUpdateCartQuantity) {
      onUpdateCartQuantity(productId, type);
    }
  };

  const handleRemoveItem = (productId) => {
    if (onRemoveCartItem) {
      onRemoveCartItem(productId);
    }
  };

  const handleClearCart = () => {
    if (onClearCart) {
      onClearCart();
    }

    setPromoCode("");
    setAppliedPromo(null);
    setPromoMessage("");
    setShowPromoSuggestion(false);
  };

  const handleCheckout = () => {
    console.log("Checkout clicked:", {
      cartItems,
      originalSubtotal: cartOriginalSubtotal,
      productDiscount: productDiscountAmount,
      subtotal: cartSubtotal,
      tax: taxAmount,
      promoCode: appliedPromo?.code || "",
      promoDiscount: promoDiscountAmount,
      total: cartTotal,
    });
  };

  const handleApplyPromo = () => {
    const cleanCode = promoCode.trim().toUpperCase();

    if (!cleanCode) {
      setAppliedPromo(null);
      setPromoMessage("Please enter a promo code.");
      return;
    }

    const matchedPromo = promoCodes.find((promo) => promo.code === cleanCode);

    if (!matchedPromo) {
      setAppliedPromo(null);
      setPromoMessage("Invalid promo code. Please try another code.");
      return;
    }

    setAppliedPromo(matchedPromo);
    setPromoMessage(`${matchedPromo.code} applied successfully.`);
  };

  const handleCopyPromo = async () => {
    try {
      await navigator.clipboard.writeText(suggestedPromo.code);
      setPromoCode(suggestedPromo.code);
      setPromoMessage(`${suggestedPromo.code} copied. Now click Apply.`);
      setShowPromoSuggestion(false);
    } catch {
      setPromoCode(suggestedPromo.code);
      setPromoMessage("Promo code added. Now click Apply.");
      setShowPromoSuggestion(false);
    }
  };

  const handleContinueShopping = () => {
    navigate("/products");
  };

  const handleProductClick = (item) => {
    if (item.path) {
      navigate(item.path);
      return;
    }

    if (item.slug) {
      navigate(`/products/${item.slug}`);
    }
  };

  return (
    <main className="cart-page">
      <section className="cart-section">
        <div className="container-fluid cart-container">
          <div className="cart-breadcrumb">
            <button
              type="button"
              aria-label="Go to homepage"
              onClick={() => navigate("/")}
            >
              <ion-icon name="home-outline"></ion-icon>
            </button>

            <span>/</span>
            <strong>Shopping Cart</strong>
          </div>

          <div className="cart-heading-row">
            <div>
              <span className="cart-section-label">ORDER REVIEW</span>
              <h1>Review Your Cart</h1>
            </div>

            {cartItems.length > 0 && (
              <div className="cart-heading-actions">
                <button
                  type="button"
                  className="cart-clear-btn"
                  onClick={handleClearCart}
                >
                  Clear
                  <ion-icon name="close-outline"></ion-icon>
                </button>
              </div>
            )}
          </div>

          {cartItems.length > 0 ? (
            <div className="cart-layout">
              <div className="cart-items-card">
                {cartItems.map((item) => {
                  const quantity = Number(item.quantity || 1);
                  const subtotal = Number(item.price || 0) * quantity;

                  const tags = item.tags || [
                    item.group,
                    item.subCategory,
                    item.source,
                  ];

                  const visibleTags = tags.filter(Boolean).slice(0, 3);

                  return (
                    <article className="cart-item" key={item.id}>
                      <button
                        type="button"
                        className="cart-product-image"
                        onClick={() => handleProductClick(item)}
                        aria-label={`View ${item.title}`}
                      >
                        {item.image ? (
                          <img src={item.image} alt={item.title} />
                        ) : (
                          <span></span>
                        )}
                      </button>

                      <div className="cart-product-content">
                        <div className="cart-mobile-title-row">
                          <button
                            type="button"
                            className="cart-product-title"
                            onClick={() => handleProductClick(item)}
                          >
                            {item.title}
                          </button>

                          <strong className="cart-mobile-price">
                            ${subtotal.toFixed(2)}
                          </strong>
                        </div>

                        <p>
                          <em>by</em> {item.author || "Templaraa Studio"}
                        </p>

                        <div className="cart-product-tags">
                          <span>Tags:</span>

                          {visibleTags.map((tag, index) => (
                            <small
                              key={`${item.id}-${tag}`}
                              className={index === 0 ? "highlight" : ""}
                            >
                              {tag}
                              {index < visibleTags.length - 1 ? "," : ""}
                            </small>
                          ))}
                        </div>

                        <div className="cart-mobile-actions">
                          <div className="cart-quantity-control">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                handleQuantityChange(item.id, "decrease")
                              }
                            >
                              <ion-icon name="remove-outline"></ion-icon>
                            </button>

                            <span>{String(quantity).padStart(2, "0")}</span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                handleQuantityChange(item.id, "increase")
                              }
                            >
                              <ion-icon name="add-outline"></ion-icon>
                            </button>
                          </div>

                          <button
                            type="button"
                            className="cart-remove-btn"
                            aria-label="Remove item"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <ion-icon name="trash-outline"></ion-icon>
                          </button>
                        </div>
                      </div>

                      <div className="cart-item-actions">
                        <strong className="cart-product-price">
                          ${subtotal.toFixed(2)}
                        </strong>

                        <div className="cart-action-row">
                          <div className="cart-quantity-control">
                            <button
                              type="button"
                              aria-label="Decrease quantity"
                              onClick={() =>
                                handleQuantityChange(item.id, "decrease")
                              }
                            >
                              <ion-icon name="remove-outline"></ion-icon>
                            </button>

                            <span>{String(quantity).padStart(2, "0")}</span>

                            <button
                              type="button"
                              aria-label="Increase quantity"
                              onClick={() =>
                                handleQuantityChange(item.id, "increase")
                              }
                            >
                              <ion-icon name="add-outline"></ion-icon>
                            </button>
                          </div>

                          <button
                            type="button"
                            className="cart-remove-btn"
                            aria-label="Remove item"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <ion-icon name="trash-outline"></ion-icon>
                          </button>
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>

              <aside className="cart-summary-card">
                <h2>Order Summary</h2>

                <div className="cart-summary-list">
                  <div>
                    <span>Subtotal</span>
                    <strong>${cartOriginalSubtotal.toFixed(2)}</strong>
                  </div>

                  <div>
                    <span>Product Discount</span>
                    <strong className="discount-value">
                      -${productDiscountAmount.toFixed(2)}
                    </strong>
                  </div>

                  <div>
                    <span>Tax</span>
                    <strong>${taxAmount.toFixed(2)}</strong>
                  </div>

                  {appliedPromo && (
                    <div>
                      <span>Promo Discount</span>
                      <strong className="discount-value">
                        -${promoDiscountAmount.toFixed(2)}
                      </strong>
                    </div>
                  )}
                </div>

                <div className="cart-summary-divider"></div>

                <div className="cart-total-row">
                  <span>Total</span>
                  <strong>${cartTotal.toFixed(2)}</strong>
                </div>

                {showPromoSuggestion && suggestedPromo && (
                  <div className="cart-promo-suggestion">
                    <div>
                      <span>Available promo</span>
                      <small>Visible for 30 seconds</small>
                    </div>

                    <button type="button" onClick={handleCopyPromo}>
                      <strong>{suggestedPromo.code}</strong>
                      <small>{suggestedPromo.label}</small>
                      <ion-icon name="copy-outline"></ion-icon>
                    </button>
                  </div>
                )}

                <div className="cart-promo-row">
                  <label className="cart-promo-field">
                    <ion-icon name="pricetag-outline"></ion-icon>

                    <input
                      type="text"
                      placeholder="Add promo code"
                      value={promoCode}
                      onChange={(event) => {
                        setPromoCode(event.target.value.toUpperCase());
                        setPromoMessage("");
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    className="cart-promo-btn"
                    onClick={handleApplyPromo}
                  >
                    Apply
                  </button>
                </div>

                {promoMessage && (
                  <p
                    className={
                      appliedPromo
                        ? "cart-promo-message success"
                        : "cart-promo-message"
                    }
                  >
                    {promoMessage}
                  </p>
                )}

                <button
                  type="button"
                  className="cart-checkout-btn"
                  onClick={handleCheckout}
                >
                  Go to Checkout
                  <ion-icon name="arrow-forward-outline"></ion-icon>
                </button>
              </aside>
            </div>
          ) : (
            <div className="cart-empty-state">
              <div className="cart-empty-icon">
                <ion-icon name="cart-outline"></ion-icon>
              </div>

              <h2>Your cart is empty</h2>

              <p>
                Looks like you have not added any templates yet. Explore our
                marketplace and find your next premium design.
              </p>

              <button type="button" onClick={handleContinueShopping}>
                Continue Shopping
                <ion-icon name="arrow-forward-outline"></ion-icon>
              </button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Cart;