import { useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { products } from "../../data/products";
import "./ProductDetails.css";

const normalizeText = (value = "") => {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

function ProductDetails({ onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);

  const product = useMemo(() => {
    return products.find((item) => item.slug === slug);
  }, [slug]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    return products
      .filter(
        (item) =>
          item.id !== product.id &&
          (item.group === product.group ||
            item.subCategory === product.subCategory)
      )
      .slice(0, 3);
  }, [product]);

  if (!product) {
    return (
      <main className="product-details-page">
        <section className="product-details-not-found">
          <h1>Product not found</h1>
          <p>The product you are looking for does not exist.</p>

          <button type="button" onClick={() => navigate("/products")}>
            Back to Products
          </button>
        </section>
      </main>
    );
  }

  const productSku = `TPL-${String(product.id).padStart(3, "0")}`;
  const oldPrice = Number(
    product.oldPrice || product.price + product.price * 0.18
  );

  const discount = Math.max(
    1,
    Math.round(((oldPrice - product.price) / oldPrice) * 100)
  );

  const ratingStars = Array.from({ length: 5 }).map((_, index) => index + 1);

  const handleQuantityMinus = () => {
    setQuantity((current) => Math.max(1, current - 1));
  };

  const handleQuantityPlus = () => {
    setQuantity((current) => current + 1);
  };

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart({
        ...product,
        quantity,
      });
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    console.log("Buy now:", product);
  };

  const handleRelatedClick = (item) => {
    navigate(item.path);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <main className="product-details-page">
      <section className="details-main-section">
        <div className="container-fluid details-container">
          <div className="details-breadcrumb">
            <button type="button" onClick={() => navigate("/")}>
              <ion-icon name="home-outline"></ion-icon>
            </button>

            <span>/</span>

            <button type="button" onClick={() => navigate("/products")}>
              Products
            </button>

            <span>/</span>

            <button
              type="button"
              onClick={() =>
                navigate(
                  `/products?category=${encodeURIComponent(product.group)}`
                )
              }
            >
              {product.group}
            </button>
          </div>

          <div className="details-hero-layout">
            <div className="details-gallery-area single-preview">
              <div className="details-preview-card">
                {product.badge ? (
                  <span
                    className={`details-preview-badge ${normalizeText(
                      product.badge
                    )}`}
                  >
                    {product.badge}
                  </span>
                ) : null}

                <img src={product.image} alt={product.title} />
              </div>
            </div>

            <div className="details-summary-area">
              <div className="details-title-row">
                <h1>{product.title}</h1>

                <span className="details-stock-badge">
                  <ion-icon name="checkmark-circle"></ion-icon>
                  Available
                </span>
              </div>

              <div className="details-rating-row">
                <div className="details-stars">
                  {ratingStars.map((star) => (
                    <ion-icon
                      key={star}
                      name={star <= product.rating ? "star" : "star-outline"}
                    ></ion-icon>
                  ))}
                </div>

                <span>{product.rating}.0 Rating</span>

                <em></em>

                <span>{product.sales || "88 Sales"}</span>

                <em></em>

                <span>SKU: {productSku}</span>
              </div>

              <div className="details-price-row">
                <del>${oldPrice.toFixed(2)}</del>
                <strong>${Number(product.price).toFixed(2)}</strong>
                <small>{discount}% Off</small>
              </div>

              <div className="details-divider"></div>

              <div className="details-author-share-row">
                <div className="details-author-box">
                  <span>Creator:</span>

                  <div>
                    <strong>{product.author}</strong>
                    <small>{product.source}</small>
                  </div>
                </div>

                <div className="details-share-box">
                  <span>Share item:</span>

                  <button type="button" aria-label="Share on Facebook">
                    <ion-icon name="logo-facebook"></ion-icon>
                  </button>

                  <button type="button" aria-label="Share on Twitter">
                    <ion-icon name="logo-twitter"></ion-icon>
                  </button>

                  <button type="button" aria-label="Share on LinkedIn">
                    <ion-icon name="logo-linkedin"></ion-icon>
                  </button>

                  <button type="button" aria-label="Copy product link">
                    <ion-icon name="link-outline"></ion-icon>
                  </button>
                </div>
              </div>

              <p className="details-short-description">{product.description}</p>

              <div className="details-divider"></div>

              <div className="details-action-panel">
                <div className="details-quantity-control">
                  <button type="button" onClick={handleQuantityMinus}>
                    <ion-icon name="remove-outline"></ion-icon>
                  </button>

                  <span>{quantity}</span>

                  <button type="button" onClick={handleQuantityPlus}>
                    <ion-icon name="add-outline"></ion-icon>
                  </button>
                </div>

                <button
                  type="button"
                  className="details-add-cart-btn"
                  onClick={handleAddToCart}
                >
                  Add to Cart
                  <ion-icon name="cart-outline"></ion-icon>
                </button>

                <button
                  type="button"
                  className={
                    isWishlisted
                      ? "details-wishlist-btn active"
                      : "details-wishlist-btn"
                  }
                  onClick={() => setIsWishlisted((current) => !current)}
                  aria-label="Add to wishlist"
                >
                  <ion-icon
                    name={isWishlisted ? "heart" : "heart-outline"}
                  ></ion-icon>
                </button>
              </div>

              <button
                type="button"
                className="details-buy-now-btn"
                onClick={handleBuyNow}
              >
                Buy Now
              </button>

              <div className="details-divider"></div>

              <div className="details-meta-list">
                <p>
                  <strong>Category:</strong>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/products?category=${encodeURIComponent(
                          product.group
                        )}`
                      )
                    }
                  >
                    {product.group}
                  </button>
                </p>

                <p>
                  <strong>Sub Category:</strong>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/products?category=${encodeURIComponent(
                          product.group
                        )}&subCategory=${encodeURIComponent(
                          product.subCategory
                        )}`
                      )
                    }
                  >
                    {product.subCategory}
                  </button>
                </p>

                <p>
                  <strong>Tags:</strong>
                  {product.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </p>
              </div>
            </div>
          </div>

          <div className="details-tabs-section">
            <div className="details-tabs-nav">
              <button
                type="button"
                className={activeTab === "description" ? "active" : ""}
                onClick={() => setActiveTab("description")}
              >
                Descriptions
              </button>

              <button
                type="button"
                className={activeTab === "information" ? "active" : ""}
                onClick={() => setActiveTab("information")}
              >
                Additional Information
              </button>

              <button
                type="button"
                className={activeTab === "feedback" ? "active" : ""}
                onClick={() => setActiveTab("feedback")}
              >
                Customer Feedback
              </button>
            </div>

            {activeTab === "description" && (
              <div className="details-tab-content details-description-grid">
                <div className="details-description-left">
                  <p>{product.documentation}</p>

                  <ul>
                    {product.features.map((feature) => (
                      <li key={feature}>
                        <ion-icon name="checkmark-circle"></ion-icon>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  <p>
                    This template is built for fast launch, clean
                    customization, and professional presentation. You can use it
                    as a complete starter kit for client work, marketplace
                    projects, or your own production-ready website.
                  </p>
                </div>

                <div className="details-description-right">
                  <div className="details-video-card">
                    <img src={product.image} alt={product.title} />

                    <button type="button" aria-label="Play preview video">
                      <ion-icon name="play"></ion-icon>
                    </button>
                  </div>

                  <div className="details-highlight-card">
                    <div>
                      <span>
                        <ion-icon name="pricetag-outline"></ion-icon>
                      </span>

                      <div>
                        <strong>{discount}% Discount</strong>
                        <p>Save more on this premium template pack</p>
                      </div>
                    </div>

                    <div>
                      <span>
                        <ion-icon name="shield-checkmark-outline"></ion-icon>
                      </span>

                      <div>
                        <strong>Quality Checked</strong>
                        <p>Clean structure and reusable sections</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "information" && (
              <div className="details-tab-content">
                <div className="details-info-table">
                  <div>
                    <strong>Product Type</strong>
                    <span>{product.group} Template</span>
                  </div>

                  <div>
                    <strong>Sub Category</strong>
                    <span>{product.subCategory}</span>
                  </div>

                  <div>
                    <strong>Creator</strong>
                    <span>{product.author}</span>
                  </div>

                  <div>
                    <strong>License</strong>
                    <span>Commercial Use</span>
                  </div>

                  <div>
                    <strong>Responsive</strong>
                    <span>Desktop, Tablet, Mobile</span>
                  </div>

                  <div>
                    <strong>Included Pages</strong>
                    <span>{product.includedPages.length} Pages</span>
                  </div>
                </div>

                <div className="details-included-pages">
                  <h3>Included Pages</h3>

                  <ol>
                    {product.includedPages.map((page) => (
                      <li key={page}>{page}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {activeTab === "feedback" && (
              <div className="details-tab-content">
                <div className="details-feedback-card">
                  <div className="details-feedback-score">
                    <strong>{product.rating}.0</strong>

                    <div>
                      {ratingStars.map((star) => (
                        <ion-icon
                          key={star}
                          name={
                            star <= product.rating ? "star" : "star-outline"
                          }
                        ></ion-icon>
                      ))}
                    </div>

                    <span>
                      Based on template quality, UI consistency, and value.
                    </span>
                  </div>

                  <div className="details-feedback-list">
                    <article>
                      <h4>Excellent visual quality</h4>
                      <p>
                        Clean layout, strong spacing, and premium sections make
                        this template feel production-ready.
                      </p>
                    </article>

                    <article>
                      <h4>Easy to customize</h4>
                      <p>
                        The structure is simple to adapt for different business,
                        portfolio, ecommerce, or SaaS projects.
                      </p>
                    </article>
                  </div>
                </div>
              </div>
            )}
          </div>

          {relatedProducts.length > 0 && (
            <div className="details-related-section">
              <div className="details-related-heading">
                <span>RELATED PRODUCTS</span>
                <h2>More templates you may like</h2>
              </div>

              <div className="details-related-grid">
                {relatedProducts.map((item) => (
                  <article
                    className="details-related-card"
                    key={item.id}
                    onClick={() => handleRelatedClick(item)}
                  >
                    <div className="details-related-img">
                      <img src={item.image} alt={item.title} />
                    </div>

                    <div className="details-related-content">
                      <span>{item.group}</span>
                      <h3>{item.title}</h3>
                      <p>by {item.author}</p>

                      <div>
                        <strong>${item.price}</strong>
                        <small>{item.subCategory}</small>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;