import { useEffect, useMemo, useRef, useState } from "react";
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
    title: "Excellent template quality",
    comment: `${product.title} feels clean, modern, and very easy to customize. The layout quality is strong and the responsive behavior works nicely for client projects.`,
  },
  {
    id: 2,
    name: "Jane Cooper",
    time: "15 hours ago",
    rating: 5,
    title: "Easy to customize",
    comment: `The ${product.subCategory} structure is practical and well organized. It has useful sections, polished spacing, and a professional visual style.`,
  },
  {
    id: 3,
    name: "Jacob Jones",
    time: "1 week ago",
    rating: 5,
    title: "Saved a lot of time",
    comment:
      "The component structure is simple to understand and the design hierarchy feels premium. It saved a lot of time during customization.",
  },
  {
    id: 4,
    name: "Ralph Edwards",
    time: "2 weeks ago",
    rating: 5,
    title: "Great value",
    comment:
      "Great value for the price. The pages are responsive, the sections are reusable, and the template feels production-ready.",
  },
];

const getFallbackInstallation = (product) => {
  const projectFolder = normalizeText(product.title) || "templaraa-project";

  return {
    prerequisites: [
      "Node.js 18+ installed",
      "npm or yarn package manager",
      "Git for version control",
      "A modern code editor like VS Code",
    ],
    steps: [
      {
        id: 1,
        title: "Clone the Repository",
        subtitle: "Start by cloning the project to your local machine",
        language: "BASH",
        code: `git clone https://github.com/your-org/${projectFolder}.git`,
        note: "This will create a new directory with all the project files.",
      },
      {
        id: 2,
        title: "Install Dependencies",
        subtitle: "Navigate to the project and install required packages",
        language: "BASH",
        code: `cd ${projectFolder}\nnpm install`,
        note: "Tip: You can also use yarn install or pnpm install.",
      },
      {
        id: 3,
        title: "Start Development Server",
        subtitle: "Run the local development server and preview the template",
        language: "BASH",
        code: "npm run dev",
        note: "After running the command, open the local URL in your browser.",
      },
      {
        id: 4,
        title: "Customize Template Content",
        subtitle: "Update text, images, colors, sections, and configuration",
        language: "BASH",
        code: "src/components\nsrc/pages\nsrc/assets",
        note: `You can customize ${product.title} based on your brand, product, or client project.`,
      },
    ],
  };
};

function ProductDetails({ onAddToCart }) {
  const { slug } = useParams();
  const navigate = useNavigate();

  const relatedSliderRef = useRef(null);
  const scrollTimeoutRef = useRef(null);

  const [quantity, setQuantity] = useState(1);
  const [activeDetailsTab, setActiveDetailsTab] = useState("description");
  const [activeSupportTab, setActiveSupportTab] = useState("installation");
  const [feedbackMode, setFeedbackMode] = useState("report");

  const [isWishlisted, setIsWishlisted] = useState(false);
  const [visibleFeedbackCount, setVisibleFeedbackCount] = useState(4);

  const [customFeedbacks, setCustomFeedbacks] = useState([]);
  const [reviewRating, setReviewRating] = useState(3);

  const [reportForm, setReportForm] = useState({
    problemType: "",
    severity: "Low",
    subject: "",
    description: "",
  });

  const [reviewForm, setReviewForm] = useState({
    title: "",
    review: "",
  });

  const [contactForm, setContactForm] = useState({
    fullName: "",
    email: "",
    inquiryType: "Template customization",
    subject: "",
    projectUrl: "",
    message: "",
    agree: false,
  });

  const [contactErrors, setContactErrors] = useState({});
  const [formMessage, setFormMessage] = useState("");

  const [relatedGroupSize, setRelatedGroupSize] = useState(3);
  const [activeRelatedGroup, setActiveRelatedGroup] = useState(0);

  const product = useMemo(() => {
    const normalizedSlug = normalizeText(slug);

    return (
      products.find((item) => normalizeText(item.slug) === normalizedSlug) ||
      products.find((item) =>
        Array.isArray(item.slugAliases)
          ? item.slugAliases.some(
              (alias) => normalizeText(alias) === normalizedSlug
            )
          : false
      ) ||
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

  const sellerInfo = useMemo(() => {
    if (!product) return null;

    return {
      email: product.sellerEmail || "support@example.com",
      supportEmail: product.supportEmail || "help@example.com",
    };
  }, [product]);

  useEffect(() => {
    const updateRelatedGroupSize = () => {
      const width = window.innerWidth;

      if (width >= 1200) {
        setRelatedGroupSize(3);
      } else if (width >= 768) {
        setRelatedGroupSize(2);
      } else {
        setRelatedGroupSize(1);
      }
    };

    updateRelatedGroupSize();
    window.addEventListener("resize", updateRelatedGroupSize);

    return () => {
      window.removeEventListener("resize", updateRelatedGroupSize);
    };
  }, []);

  useEffect(() => {
    setQuantity(1);
    setActiveDetailsTab("description");
    setActiveSupportTab("installation");
    setFeedbackMode("report");
    setVisibleFeedbackCount(4);
    setCustomFeedbacks([]);
    setFormMessage("");
    setContactErrors({});
    setReviewRating(3);
    setActiveRelatedGroup(0);

    setContactForm({
      fullName: "",
      email: "",
      inquiryType: "Template customization",
      subject: "",
      projectUrl: "",
      message: "",
      agree: false,
    });

    if (relatedSliderRef.current) {
      relatedSliderRef.current.scrollTo({
        left: 0,
        behavior: "auto",
      });
    }
  }, [slug]);

  useEffect(() => {
    if (relatedSliderRef.current) {
      relatedSliderRef.current.scrollTo({
        left: 0,
        behavior: "auto",
      });
    }

    setActiveRelatedGroup(0);
  }, [relatedGroupSize, relatedProducts.length]);

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
  const discount = Number(product.discountPercent || product.discount || 18);

  const oldPrice = Number(
    product.oldPrice || product.price / (1 - discount / 100)
  );

  const ratingStars = Array.from({ length: 5 }).map((_, index) => index + 1);

  const defaultFeedbacks =
    product.feedbacks ||
    product.reviews ||
    product.customerFeedback ||
    getFallbackFeedbacks(product);

  const feedbacks = [...customFeedbacks, ...defaultFeedbacks];
  const visibleFeedbacks = feedbacks.slice(0, visibleFeedbackCount);

  const installationGuide =
    product.installationGuide || getFallbackInstallation(product);

  const relatedDotCount = Math.max(
    1,
    Math.ceil(relatedProducts.length / relatedGroupSize)
  );

  const getRelatedCardDistance = () => {
    const slider = relatedSliderRef.current;
    const card = slider?.querySelector(".details-related-card");

    if (!slider || !card) return 0;

    const sliderStyle = window.getComputedStyle(slider);
    const gap =
      Number.parseFloat(sliderStyle.columnGap || sliderStyle.gap) || 22;

    return card.offsetWidth + gap;
  };

  const getRelatedTargetCardIndex = (groupIndex) => {
    const lastStartIndex = Math.max(
      0,
      relatedProducts.length - relatedGroupSize
    );

    const targetIndex = groupIndex * relatedGroupSize;

    return Math.min(targetIndex, lastStartIndex);
  };

  const scrollToRelatedGroup = (groupIndex) => {
    const slider = relatedSliderRef.current;
    const distance = getRelatedCardDistance();

    if (!slider || !distance) return;

    const safeGroupIndex = Math.max(
      0,
      Math.min(groupIndex, relatedDotCount - 1)
    );

    const targetCardIndex = getRelatedTargetCardIndex(safeGroupIndex);
    const targetLeft = targetCardIndex * distance;
    const maxLeft = slider.scrollWidth - slider.clientWidth;

    slider.scrollTo({
      left: Math.min(targetLeft, maxLeft),
      behavior: "smooth",
    });

    setActiveRelatedGroup(safeGroupIndex);
  };

  const handleRelatedSlide = (direction) => {
    const nextGroup =
      direction === "next" ? activeRelatedGroup + 1 : activeRelatedGroup - 1;

    const safeNextGroup =
      nextGroup < 0
        ? relatedDotCount - 1
        : nextGroup > relatedDotCount - 1
        ? 0
        : nextGroup;

    scrollToRelatedGroup(safeNextGroup);
  };

  const handleRelatedScroll = () => {
    const slider = relatedSliderRef.current;

    if (!slider) return;

    window.clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = window.setTimeout(() => {
      const maxLeft = slider.scrollWidth - slider.clientWidth;

      if (maxLeft <= 0) {
        setActiveRelatedGroup(0);
        return;
      }

      const progress = slider.scrollLeft / maxLeft;
      const groupIndex = Math.round(progress * (relatedDotCount - 1));
      const safeGroupIndex = Math.max(
        0,
        Math.min(groupIndex, relatedDotCount - 1)
      );

      setActiveRelatedGroup(safeGroupIndex);
    }, 60);
  };

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

  const handleCopyText = async (text, successMessage) => {
    try {
      await navigator.clipboard.writeText(text);
      setFormMessage(successMessage);
    } catch {
      setFormMessage("Copy failed. Please copy manually.");
    }
  };

  const handleCopyCode = async (code) => {
    handleCopyText(code, "Command copied successfully.");
  };

  const handleReportSubmit = (event) => {
    event.preventDefault();

    setFormMessage(
      "Your report has been submitted. The seller will review this issue soon."
    );

    setReportForm({
      problemType: "",
      severity: "Low",
      subject: "",
      description: "",
    });
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!reviewForm.review.trim()) {
      setFormMessage("Please write your review before submitting.");
      return;
    }

    const newFeedback = {
      id: `custom-${Date.now()}`,
      name: "You",
      time: "Just now",
      rating: reviewRating,
      title: reviewForm.title || "Customer review",
      comment: reviewForm.review,
    };

    setCustomFeedbacks((current) => [newFeedback, ...current]);
    setReviewForm({
      title: "",
      review: "",
    });

    setActiveDetailsTab("feedback");
    setFormMessage("Your review has been added to Customer Feedback.");
  };

  const handleContactInputChange = (field, value) => {
    setContactForm((current) => ({
      ...current,
      [field]: value,
    }));

    setContactErrors((current) => ({
      ...current,
      [field]: "",
    }));
  };

  const validateContactForm = () => {
    const errors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!contactForm.fullName.trim()) {
      errors.fullName = "Full name is required.";
    }

    if (!contactForm.email.trim()) {
      errors.email = "Email address is required.";
    } else if (!emailRegex.test(contactForm.email)) {
      errors.email = "Please enter a valid email address.";
    }

    if (!contactForm.subject.trim()) {
      errors.subject = "Subject is required.";
    }

    if (!contactForm.message.trim()) {
      errors.message = "Message is required.";
    } else if (contactForm.message.trim().length < 20) {
      errors.message = "Message should be at least 20 characters.";
    }

    if (!contactForm.agree) {
      errors.agree = "Please confirm before sending.";
    }

    return errors;
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();

    const errors = validateContactForm();

    if (Object.keys(errors).length > 0) {
      setContactErrors(errors);
      setFormMessage("Please fix the highlighted contact form fields.");
      return;
    }

    const contactPayload = {
      productId: product.id,
      productTitle: product.title,
      sellerEmail: sellerInfo.email,
      ...contactForm,
    };

    console.log("Contact seller message:", contactPayload);

    setFormMessage(
      "Your message has been submitted successfully. The seller will contact you soon."
    );

    setContactErrors({});

    setContactForm({
      fullName: "",
      email: "",
      inquiryType: "Template customization",
      subject: "",
      projectUrl: "",
      message: "",
      agree: false,
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
            <button
              type="button"
              aria-label="Go to homepage"
              onClick={() => navigate("/")}
            >
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
            <div className="details-gallery-area single-preview details-sticky-gallery">
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

            <div className="details-summary-area details-scroll-summary">
              <div className="details-title-row">
                <h1>{product.title}</h1>
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

                    <button
                      type="button"
                      aria-label="Copy product link"
                      onClick={() =>
                        handleCopyText(
                          window.location.href,
                          "Product link copied successfully."
                        )
                      }
                    >
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
                  <button
                    type="button"
                    aria-label="Decrease quantity"
                    onClick={handleQuantityMinus}
                  >
                    <ion-icon name="remove-outline"></ion-icon>
                  </button>

                  <span>{quantity}</span>

                  <button
                    type="button"
                    aria-label="Increase quantity"
                    onClick={handleQuantityPlus}
                  >
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

                <button
                  type="button"
                  className="details-buy-now-btn"
                  onClick={handleBuyNow}
                >
                  Buy Now
                </button>
              </div>

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

                  {(product.tags || [])
                    .filter(Boolean)
                    .map((tag, index, array) => (
                      <span key={`${tag}-${index}`}>
                        {tag}
                        {index < array.length - 1 ? "," : ""}
                      </span>
                    ))}
                </p>
              </div>
            </div>
          </div>

          <div className="details-tabs-section">
            <div className="details-tabs-nav">
              <button
                type="button"
                className={activeDetailsTab === "description" ? "active" : ""}
                onClick={() => setActiveDetailsTab("description")}
              >
                Descriptions
              </button>

              <button
                type="button"
                className={activeDetailsTab === "information" ? "active" : ""}
                onClick={() => setActiveDetailsTab("information")}
              >
                Additional Information
              </button>

              <button
                type="button"
                className={activeDetailsTab === "feedback" ? "active" : ""}
                onClick={() => setActiveDetailsTab("feedback")}
              >
                Customer Feedback
              </button>
            </div>

            {activeDetailsTab === "description" && (
              <div className="details-tab-content details-description-grid">
                <div className="details-description-left">
                  <p>{product.documentation}</p>

                  <ul>
                    {(product.features || []).map((feature) => (
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

            {activeDetailsTab === "information" && (
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
                    <span>{(product.includedPages || []).length} Pages</span>
                  </div>

                  <div>
                    <strong>Source</strong>
                    <span>{product.source}</span>
                  </div>
                </div>

                <div className="details-included-pages">
                  <h3>Included Pages</h3>

                  <ol>
                    {(product.includedPages || []).map((page) => (
                      <li key={page}>{page}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {activeDetailsTab === "feedback" && (
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

                        {feedback.title ? <h5>{feedback.title}</h5> : null}
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

          <div className="details-support-section">
            <div className="details-support-card">
              <div className="details-support-tabs">
                <button
                  type="button"
                  className={activeSupportTab === "installation" ? "active" : ""}
                  onClick={() => {
                    setActiveSupportTab("installation");
                    setFormMessage("");
                  }}
                >
                  Installation Guide
                </button>

                <button
                  type="button"
                  className={activeSupportTab === "feedback" ? "active" : ""}
                  onClick={() => {
                    setActiveSupportTab("feedback");
                    setFormMessage("");
                  }}
                >
                  Product Feedback
                </button>

                <button
                  type="button"
                  className={activeSupportTab === "contact" ? "active" : ""}
                  onClick={() => {
                    setActiveSupportTab("contact");
                    setFormMessage("");
                  }}
                >
                  Contact Seller
                </button>
              </div>

              <div className="details-support-content">
                {formMessage ? (
                  <div className="details-form-message">
                    <ion-icon name="checkmark-circle-outline"></ion-icon>
                    {formMessage}
                  </div>
                ) : null}

                {activeSupportTab === "installation" && (
                  <div className="details-installation-content">
                    <div className="details-prerequisite-box">
                      <h3>Prerequisites</h3>

                      <ul>
                        {installationGuide.prerequisites.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="details-installation-steps">
                      {installationGuide.steps.map((step) => (
                        <div className="details-install-step" key={step.id}>
                          <div className="details-step-number">{step.id}</div>

                          <div className="details-step-content">
                            <h3>{step.title}</h3>
                            <p>{step.subtitle}</p>

                            <div className="details-code-card">
                              <div className="details-code-head">
                                <span>{step.language}</span>

                                <button
                                  type="button"
                                  onClick={() => handleCopyCode(step.code)}
                                >
                                  <ion-icon name="copy-outline"></ion-icon>
                                  Copy
                                </button>
                              </div>

                              <pre>
                                <code>{step.code}</code>
                              </pre>
                            </div>

                            {step.note ? (
                              <div className="details-code-note">
                                {step.note}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeSupportTab === "feedback" && (
                  <div className="details-product-feedback-content">
                    <div className="details-feedback-mode-row">
                      <label>
                        <input
                          type="radio"
                          name="feedbackMode"
                          checked={feedbackMode === "report"}
                          onChange={() => setFeedbackMode("report")}
                        />
                        <span></span>
                        Report issue
                      </label>

                      <label>
                        <input
                          type="radio"
                          name="feedbackMode"
                          checked={feedbackMode === "review"}
                          onChange={() => setFeedbackMode("review")}
                        />
                        <span></span>
                        Review
                      </label>
                    </div>

                    {feedbackMode === "report" && (
                      <form
                        className="details-feedback-form"
                        onSubmit={handleReportSubmit}
                      >
                        <div className="details-form-left">
                          <label className="details-input-group">
                            <span>Problem Type</span>

                            <input
                              type="text"
                              placeholder="Search products"
                              value={reportForm.problemType}
                              onChange={(event) =>
                                setReportForm((current) => ({
                                  ...current,
                                  problemType: event.target.value,
                                }))
                              }
                            />
                          </label>

                          <div className="details-severity-group">
                            <span>Severity Level</span>

                            <div>
                              {["Low", "Mid", "High", "Critical"].map(
                                (level) => (
                                  <label key={level}>
                                    <input
                                      type="radio"
                                      name="severity"
                                      checked={reportForm.severity === level}
                                      onChange={() =>
                                        setReportForm((current) => ({
                                          ...current,
                                          severity: level,
                                        }))
                                      }
                                    />
                                    <span></span>
                                    {level}
                                  </label>
                                )
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="details-form-right">
                          <label className="details-input-group">
                            <span>Subject</span>

                            <input
                              type="text"
                              placeholder="Search products"
                              value={reportForm.subject}
                              onChange={(event) =>
                                setReportForm((current) => ({
                                  ...current,
                                  subject: event.target.value,
                                }))
                              }
                            />
                          </label>

                          <label className="details-input-group">
                            <span>Detailed Description *</span>

                            <textarea
                              placeholder="Search products"
                              value={reportForm.description}
                              onChange={(event) =>
                                setReportForm((current) => ({
                                  ...current,
                                  description: event.target.value,
                                }))
                              }
                              required
                            ></textarea>
                          </label>

                          <button type="submit" className="details-submit-btn">
                            Submit Report
                          </button>
                        </div>
                      </form>
                    )}

                    {feedbackMode === "review" && (
                      <form
                        className="details-feedback-form"
                        onSubmit={handleReviewSubmit}
                      >
                        <div className="details-form-left">
                          <div className="details-review-rating-box">
                            <span>Ratings</span>

                            <div>
                              <div className="details-review-stars">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button
                                    type="button"
                                    key={star}
                                    className={
                                      star <= reviewRating ? "active" : ""
                                    }
                                    onClick={() => setReviewRating(star)}
                                    aria-label={`Rate ${star} stars`}
                                  >
                                    <ion-icon
                                      name={
                                        star <= reviewRating
                                          ? "star"
                                          : "star-outline"
                                      }
                                    ></ion-icon>
                                  </button>
                                ))}
                              </div>

                              <p>You rated : {reviewRating} stars</p>
                            </div>
                          </div>
                        </div>

                        <div className="details-form-right">
                          <label className="details-input-group">
                            <span>Review Title</span>

                            <input
                              type="text"
                              value={reviewForm.title}
                              onChange={(event) =>
                                setReviewForm((current) => ({
                                  ...current,
                                  title: event.target.value,
                                }))
                              }
                            />
                          </label>

                          <label className="details-input-group">
                            <span>Your Review *</span>

                            <textarea
                              value={reviewForm.review}
                              onChange={(event) =>
                                setReviewForm((current) => ({
                                  ...current,
                                  review: event.target.value,
                                }))
                              }
                              required
                            ></textarea>
                          </label>

                          <button type="submit" className="details-submit-btn">
                            Submit Review
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                )}

                {activeSupportTab === "contact" && (
                  <div className="details-contact-content simple-contact-content">
                    <div className="details-seller-panel simple-seller-panel">
                      <div className="details-seller-info simple-seller-info">
                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(
                              sellerInfo.email,
                              "Seller email copied successfully."
                            )
                          }
                        >
                          <span>
                            <ion-icon name="mail-outline"></ion-icon>
                          </span>

                          <div>
                            <small>Primary Email</small>
                            <strong>{sellerInfo.email}</strong>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            handleCopyText(
                              sellerInfo.supportEmail,
                              "Support email copied successfully."
                            )
                          }
                        >
                          <span>
                            <ion-icon name="help-buoy-outline"></ion-icon>
                          </span>

                          <div>
                            <small>Support Email</small>
                            <strong>{sellerInfo.supportEmail}</strong>
                          </div>
                        </button>
                      </div>
                    </div>

                    <form
                      className="details-contact-form simple-contact-form"
                      onSubmit={handleContactSubmit}
                      noValidate
                    >
                      <div className="details-contact-grid">
                        <label className="details-input-group">
                          <span>Full Name *</span>

                          <input
                            type="text"
                            placeholder="Enter your full name"
                            value={contactForm.fullName}
                            onChange={(event) =>
                              handleContactInputChange(
                                "fullName",
                                event.target.value
                              )
                            }
                          />

                          {contactErrors.fullName ? (
                            <small className="details-field-error">
                              {contactErrors.fullName}
                            </small>
                          ) : null}
                        </label>

                        <label className="details-input-group">
                          <span>Email Address *</span>

                          <input
                            type="email"
                            placeholder="Enter your email address"
                            value={contactForm.email}
                            onChange={(event) =>
                              handleContactInputChange(
                                "email",
                                event.target.value
                              )
                            }
                          />

                          {contactErrors.email ? (
                            <small className="details-field-error">
                              {contactErrors.email}
                            </small>
                          ) : null}
                        </label>
                      </div>

                      <label className="details-input-group">
                        <span>Inquiry Type</span>

                        <select
                          value={contactForm.inquiryType}
                          onChange={(event) =>
                            handleContactInputChange(
                              "inquiryType",
                              event.target.value
                            )
                          }
                        >
                          <option value="Template customization">
                            Template customization
                          </option>
                          <option value="Installation help">
                            Installation help
                          </option>
                          <option value="License question">
                            License question
                          </option>
                          <option value="Pre-sale question">
                            Pre-sale question
                          </option>
                          <option value="Bug or technical issue">
                            Bug or technical issue
                          </option>
                        </select>
                      </label>

                      <label className="details-input-group">
                        <span>Subject *</span>

                        <input
                          type="text"
                          placeholder={`Question about ${product.title}`}
                          value={contactForm.subject}
                          onChange={(event) =>
                            handleContactInputChange(
                              "subject",
                              event.target.value
                            )
                          }
                        />

                        {contactErrors.subject ? (
                          <small className="details-field-error">
                            {contactErrors.subject}
                          </small>
                        ) : null}
                      </label>

                      <label className="details-input-group">
                        <span>Project URL</span>

                        <input
                          type="url"
                          placeholder="https://your-project-link.com"
                          value={contactForm.projectUrl}
                          onChange={(event) =>
                            handleContactInputChange(
                              "projectUrl",
                              event.target.value
                            )
                          }
                        />
                      </label>

                      <label className="details-input-group">
                        <span>Message *</span>

                        <textarea
                          placeholder="Write your message for the seller..."
                          value={contactForm.message}
                          onChange={(event) =>
                            handleContactInputChange(
                              "message",
                              event.target.value
                            )
                          }
                        ></textarea>

                        {contactErrors.message ? (
                          <small className="details-field-error">
                            {contactErrors.message}
                          </small>
                        ) : null}
                      </label>

                      <label className="details-contact-check">
                        <input
                          type="checkbox"
                          checked={contactForm.agree}
                          onChange={(event) =>
                            handleContactInputChange(
                              "agree",
                              event.target.checked
                            )
                          }
                        />

                        <span>
                          I confirm that my message is related to this product
                          and the seller can contact me using the provided email
                          address.
                        </span>
                      </label>

                      {contactErrors.agree ? (
                        <small className="details-field-error">
                          {contactErrors.agree}
                        </small>
                      ) : null}

                      <button type="submit" className="details-submit-btn">
                        Send Message
                        <ion-icon name="send-outline"></ion-icon>
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <div className="details-related-section">
              <div className="details-related-heading-row">
                <div className="details-related-heading">
                  <span>RELATED PRODUCTS</span>
                  <h2>More templates you may like</h2>
                </div>
              </div>

              <div className="details-related-slider-shell">
                <button
                  type="button"
                  className="details-related-mobile-control prev"
                  onClick={() => handleRelatedSlide("prev")}
                  aria-label="Previous related product"
                >
                  <ion-icon name="chevron-back-outline"></ion-icon>
                </button>

                <div
                  className="details-related-slider"
                  ref={relatedSliderRef}
                  onScroll={handleRelatedScroll}
                >
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

                        <button
                          type="button"
                          className="details-related-view-btn"
                          onClick={(event) => {
                            event.stopPropagation();
                            handleRelatedClick(item);
                          }}
                        >
                          View Details
                        </button>
                      </div>
                    </article>
                  ))}
                </div>

                <button
                  type="button"
                  className="details-related-mobile-control next"
                  onClick={() => handleRelatedSlide("next")}
                  aria-label="Next related product"
                >
                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </button>
              </div>

              {relatedDotCount > 1 && (
                <div className="details-related-dots">
                  {Array.from({ length: relatedDotCount }).map((_, index) => (
                    <button
                      key={index}
                      type="button"
                      className={activeRelatedGroup === index ? "active" : ""}
                      onClick={() => scrollToRelatedGroup(index)}
                      aria-label={`Go to related product group ${index + 1}`}
                    ></button>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default ProductDetails;