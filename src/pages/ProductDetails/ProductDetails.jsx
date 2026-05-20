import { useMemo, useRef, useState } from "react";
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

const getFallbackFeedbacks = (product) => [
  {
    id: 1,
    name: "Kristin Watson",
    time: "2 min ago",
    rating: 5,
    comment: `Clean and professional ${product.group} template. The layout feels modern, responsive, and easy to customize for a real project.`,
  },
  {
    id: 2,
    name: "Jane Cooper",
    time: "30 Apr, 2024",
    rating: 5,
    comment: `Good quality design and structure. The sections are well organized, and the ${product.subCategory} flow feels very practical.`,
  },
  {
    id: 3,
    name: "Jacob Jones",
    time: "1 week ago",
    rating: 5,
    comment:
      "The spacing, typography, and component structure are very clean. It saved a lot of time for building a polished website.",
  },
  {
    id: 4,
    name: "Ralph Edwards",
    time: "2 weeks ago",
    rating: 5,
    comment:
      "Great value for the price. The template is responsive, easy to edit, and visually consistent across sections.",
  },
];

function ProductDetails({ onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();
  const relatedSliderRef = useRef(null);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("description");
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [visibleFeedbackCount, setVisibleFeedbackCount] = useState(4);

  const product = useMemo(() => {
    const normalizedSlug = normalizeText(slug);

    return (
      products.find((item) => item.slug === slug) ||
      products.find((item) => normalizeText(item.slug) === normalizedSlug) ||
      null
    );
  }, [slug]);

  const relatedProducts = useMemo(() => {
    if (!product) return [];

    const matchedProducts = products.filter((item) => {
      if (item.id === product.id) return false;

      return (
        item.group === product.group ||
        item.subCategory === product.subCategory
      );
    });

    const extraProducts = products.filter((item) => {
      if (item.id === product.id) return false;
      return !matchedProducts.some((matched) => matched.id === item.id);
    });

    return [...matchedProducts, ...extraProducts].slice(0, 10);
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

  const feedbacks =
    product.feedbacks ||
    product.reviews ||
    product.customerFeedback ||
    getFallbackFeedbacks(product);

  const visibleFeedbacks = feedbacks.slice(0, visibleFeedbackCount);

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
    navigate(item.path || `/products/${item.slug}`, {
      replace: false,
      state: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleLoadMoreFeedback = () => {
    setVisibleFeedbackCount((current) => current + 4);
  };

  const handleRelatedSlide = (direction) => {
    const slider = relatedSliderRef.current;

    if (!slider) return;

    const card = slider.querySelector(".details-related-card");
    const sliderStyle = window.getComputedStyle(slider);
    const gap =
      Number.parseFloat(sliderStyle.columnGap || sliderStyle.gap) || 22;

    const scrollAmount = card ? card.offsetWidth + gap : 320;

    slider.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  };

  const renderStars = (count) => {
    return ratingStars.map((star) => (
      <ion-icon
        key={star}
        name={star <= Number(count) ? "star" : "star-outline"}
      ></ion-icon>
    ));
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
                <div className="details-stars">{renderStars(product.rating)}</div>

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

                  <div className="details-share-buttons">
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
              </div>

              <p className="details-short-description">
                {product.description}
              </p>

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

              <div className="details-divider details-meta-divider"></div>

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
                    <strong>Category</strong>
                    <span>{product.group}</span>
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

                  <div>
                    <strong>Source</strong>
                    <span>{product.source}</span>
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
                <div className="details-feedback-list-layout">
                  {visibleFeedbacks.map((feedback) => (
                    <article
                      className="details-feedback-item"
                      key={feedback.id || feedback.name}
                    >
                      <div className="details-feedback-avatar">
                        {feedback.avatar ? (
                          <img src={feedback.avatar} alt={feedback.name} />
                        ) : (
                          <ion-icon name="person"></ion-icon>
                        )}
                      </div>

                      <div className="details-feedback-content">
                        <div className="details-feedback-top">
                          <h4>{feedback.name}</h4>
                          <span>{feedback.time || feedback.date}</span>
                        </div>

                        <div className="details-feedback-stars">
                          {renderStars(feedback.rating || 5)}
                        </div>

                        <p>{feedback.comment}</p>
                      </div>
                    </article>
                  ))}

                  {visibleFeedbackCount < feedbacks.length && (
                    <button
                      type="button"
                      className="details-feedback-load-btn"
                      onClick={handleLoadMoreFeedback}
                    >
                      Load More
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {relatedProducts.length > 0 && (
            <div className="details-related-section">
              <div className="details-related-heading-row">
                <div className="details-related-heading">
                  <span>RELATED PRODUCTS</span>
                  <h2>More templates you may like</h2>
                </div>

                <div className="details-related-controls">
                  <button
                    type="button"
                    onClick={() => handleRelatedSlide("prev")}
                    aria-label="Previous related product"
                  >
                    <ion-icon name="chevron-back-outline"></ion-icon>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleRelatedSlide("next")}
                    aria-label="Next related product"
                  >
                    <ion-icon name="chevron-forward-outline"></ion-icon>
                  </button>
                </div>
              </div>

              <div className="details-related-slider" ref={relatedSliderRef}>
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