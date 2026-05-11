import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  products,
  allItemsMixOrder,
  mainFilters,
  sortOptions,
  categoryMap,
} from "../../data/products";
import JoinOpportunity from "../../components/JoinOpportunity/JoinOpportunity";
import "./Product.css";

const productList = products;

const normalizeText = (value = "") => {
  return String(value)
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/\+/g, "plus")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

const randomPillProducts = {
  101: "Premium",
  35: "Featured",
  102: "New",
  202: "Popular",
  39: "Featured",
  109: "Hot",
  22: "New",
  105: "Popular",
  37: "Featured",
  108: "Premium",
  207: "Premium",
  209: "New",
  204: "Popular",
  107: "New",
};

const newestPillProductOrder = [
  101, 35, 102, 202, 39, 109, 22, 105, 37, 108, 207, 209, 204, 107,
];

const getProductPill = (product) => {
  if (product.badge) {
    return product.badge;
  }

  return randomPillProducts[product.id] || "";
};

const getCategoryFromHeader = (category = "") => {
  const normalized = normalizeText(category);

  if (categoryMap[normalized]) {
    return categoryMap[normalized];
  }

  const matchedFilter = mainFilters.find(
    (item) => normalizeText(item) === normalized
  );

  return matchedFilter || "All Items";
};

const getMixedAllProducts = () => {
  const productMap = new Map(
    productList.map((product) => [product.id, product])
  );

  return allItemsMixOrder.map((id) => productMap.get(id)).filter(Boolean);
};

const getNewestPillProducts = () => {
  const productMap = new Map(
    productList.map((product) => [Number(product.id), product])
  );

  return newestPillProductOrder
    .map((id) => productMap.get(Number(id)))
    .filter(Boolean);
};

function Product({
  searchValue = "",
  onAddToCart,
  onProductClick,
  onRatingFilter,
  onJoinClick,
}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const [viewMode, setViewMode] = useState("grid");
  const [localSearch, setLocalSearch] = useState("");
  const [activeGroup, setActiveGroup] = useState("All Items");
  const [openGroup, setOpenGroup] = useState("");
  const [activeSubCategory, setActiveSubCategory] = useState("All");
  const [minPrice, setMinPrice] = useState(20);
  const [maxPrice, setMaxPrice] = useState(120);
  const [rating, setRating] = useState(0);
  const [sortBy, setSortBy] = useState("default");
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  useEffect(() => {
    const categoryFromUrl = searchParams.get("category");
    const subCategoryFromUrl = searchParams.get("subCategory");

    if (!categoryFromUrl) {
      setActiveGroup("All Items");
      setActiveSubCategory("All");
      setOpenGroup("");
      return;
    }

    const matchedGroup = getCategoryFromHeader(categoryFromUrl);

    setActiveGroup(matchedGroup);
    setActiveSubCategory(subCategoryFromUrl || "All");

    if (subCategoryFromUrl && matchedGroup !== "All Items") {
      setOpenGroup(matchedGroup);
    }
  }, [searchParams]);

  const getProductsByGroup = (group) => {
    if (group === "All Items") return productList;

    return productList.filter((product) => product.group === group);
  };

  const getSubCategoriesByGroup = (group) => {
    if (group === "All Items") return [];

    const sourceProducts = getProductsByGroup(group);
    const subCategories = sourceProducts
      .map((product) => product.subCategory)
      .filter(Boolean);

    return ["All", ...new Set(subCategories)];
  };

  const groupCount = (group) => {
    return getProductsByGroup(group).length;
  };

  const subCategoryCount = (group, subCategory) => {
    const sourceProducts = getProductsByGroup(group);

    if (subCategory === "All") {
      return sourceProducts.length;
    }

    return sourceProducts.filter(
      (product) => product.subCategory === subCategory
    ).length;
  };

  const filteredProducts = useMemo(() => {
    if (sortBy === "newest") {
      return getNewestPillProducts();
    }

    const mergedSearch = `${searchValue} ${localSearch}`.trim().toLowerCase();

    let productsData =
      activeGroup === "All Items" ? getMixedAllProducts() : [...productList];

    if (activeGroup !== "All Items") {
      productsData = productsData.filter(
        (product) => product.group === activeGroup
      );
    }

    if (activeSubCategory !== "All") {
      productsData = productsData.filter(
        (product) => product.subCategory === activeSubCategory
      );
    }

    productsData = productsData.filter((product) => {
      const productPrice = Number(product.price);
      const selectedMin = Number(minPrice);
      const selectedMax = Number(maxPrice);

      return productPrice >= selectedMin && productPrice <= selectedMax;
    });

    const selectedRating = Number(rating);

    if (selectedRating > 0) {
      productsData = productsData.filter((product) => {
        return Number(product.rating) >= selectedRating;
      });
    }

    if (mergedSearch) {
      productsData = productsData.filter((product) => {
        const searchableText = `
          ${product.title}
          ${product.author}
          ${product.group}
          ${product.subCategory}
          ${product.source}
          ${product.badge}
        `.toLowerCase();

        return searchableText.includes(mergedSearch);
      });
    }

    if (sortBy === "price-low") {
      productsData = [...productsData].sort((a, b) => a.price - b.price);
    }

    if (sortBy === "price-high") {
      productsData = [...productsData].sort((a, b) => b.price - a.price);
    }

    if (sortBy === "top-rated") {
      productsData = [...productsData].sort((a, b) => b.rating - a.rating);
    }

    return productsData;
  }, [
    activeGroup,
    activeSubCategory,
    minPrice,
    maxPrice,
    rating,
    sortBy,
    searchValue,
    localSearch,
  ]);

  const handleGroupClick = (group) => {
    setActiveGroup(group);
    setActiveSubCategory("All");

    if (group === "All Items") {
      setSearchParams({});
      setOpenGroup("");
      return;
    }

    setSearchParams({ category: group });
  };

  const handleArrowClick = (event, group) => {
    event.stopPropagation();

    if (group === "All Items") return;

    const isCurrentlyOpen = openGroup === group;

    if (isCurrentlyOpen) {
      setOpenGroup("");
      return;
    }

    setOpenGroup(group);
    setActiveGroup(group);
    setActiveSubCategory("All");
    setSearchParams({ category: group });
  };

  const handleSubCategoryClick = (event, group, subCategory) => {
    event.stopPropagation();

    setActiveGroup(group);
    setActiveSubCategory(subCategory);
    setOpenGroup(group);

    if (group === "All Items") {
      setSearchParams({});
      return;
    }

    if (subCategory === "All") {
      setSearchParams({ category: group });
      return;
    }

    setSearchParams({
      category: group,
      subCategory,
    });
  };

  const handleRatingClick = (event, selectedRating) => {
    event.stopPropagation();

    const ratingNumber = Number(selectedRating);

    setRating(ratingNumber);

    if (onRatingFilter) {
      onRatingFilter(ratingNumber);
    }
  };

  const handleClearRating = (event) => {
    event.stopPropagation();

    setRating(0);

    if (onRatingFilter) {
      onRatingFilter(0);
    }
  };

  const handleResetFilter = () => {
    setActiveGroup("All Items");
    setOpenGroup("");
    setActiveSubCategory("All");
    setMinPrice(20);
    setMaxPrice(120);
    setRating(0);
    setSortBy("default");
    setLocalSearch("");
    setSearchParams({});
    setIsMobileFilterOpen(false);

    if (onRatingFilter) {
      onRatingFilter(0);
    }
  };

  const handleBreadcrumbGroupClick = () => {
    setActiveSubCategory("All");
    setSearchParams({ category: activeGroup });
  };

  const handleApplyFilter = () => {
    setIsMobileFilterOpen(false);
  };

  const handleFilterTitleClick = () => {
    setIsMobileFilterOpen((prev) => !prev);
  };

  const handleProductClick = (product) => {
    if (onProductClick) {
      onProductClick({
        path: product.path,
        product,
      });
      return;
    }

    console.log("Go to product details:", product.path, product);
  };

  const handleAddToCart = (event, product) => {
    event.stopPropagation();

    if (onAddToCart) {
      onAddToCart(product);
      return;
    }

    console.log("Add to cart:", product);
  };

  const renderStars = (count) => {
    return Array.from({ length: 5 }).map((_, index) => {
      const value = index + 1;

      return (
        <span
          className={value <= count ? "product-star active" : "product-star"}
          key={value}
          aria-hidden="true"
        >
          <ion-icon name={value <= count ? "star" : "star-outline"}></ion-icon>
        </span>
      );
    });
  };

  const productGridClass =
    viewMode === "grid"
      ? activeSubCategory !== "All"
        ? "product-grid show-product-tags"
        : "product-grid"
      : activeSubCategory !== "All"
      ? "product-grid product-list-view show-product-tags"
      : "product-grid product-list-view";

  return (
    <main className="product-page">
      <section className="product-listing-section">
        <div className="container-fluid product-listing-container">
          <div className="product-breadcrumb">
            <button
              type="button"
              aria-label="Go to all products"
              onClick={handleResetFilter}
            >
              <ion-icon name="home-outline"></ion-icon>
            </button>

            <button
              type="button"
              className="product-breadcrumb-link"
              onClick={handleResetFilter}
            >
              Products
            </button>

            {activeGroup !== "All Items" && (
              <>
                <span>/</span>

                <button
                  type="button"
                  className="product-breadcrumb-link active"
                  onClick={handleBreadcrumbGroupClick}
                >
                  {activeGroup}
                </button>
              </>
            )}

            {activeSubCategory !== "All" && (
              <>
                <span>/</span>

                <button
                  type="button"
                  className="product-breadcrumb-link active-sub"
                  aria-label={activeSubCategory}
                >
                  {activeSubCategory}
                </button>
              </>
            )}
          </div>

          <div className="product-listing-layout">
            <aside
              className={
                isMobileFilterOpen
                  ? "product-filter-panel filter-open"
                  : "product-filter-panel"
              }
            >
              <div className="product-filter-head">
                <button
                  type="button"
                  className="product-filter-title-toggle"
                  onClick={handleFilterTitleClick}
                >
                  <ion-icon name="options-outline"></ion-icon>
                  <span>Filters</span>
                </button>

                <button
                  type="button"
                  className="product-filter-reset-btn"
                  onClick={handleResetFilter}
                >
                  Reset
                </button>
              </div>

              <div className="product-filter-search">
                <input
                  type="text"
                  placeholder="Search products"
                  value={localSearch}
                  onChange={(event) => setLocalSearch(event.target.value)}
                />
                <ion-icon name="search-outline"></ion-icon>
              </div>

              {isMobileFilterOpen && (
                <button
                  type="button"
                  className="product-mobile-close-filter"
                  onClick={() => setIsMobileFilterOpen(false)}
                >
                  <span>Close Filter</span>
                  <ion-icon name="close-outline"></ion-icon>
                </button>
              )}

              <div
                className={
                  isMobileFilterOpen
                    ? "product-filter-body open"
                    : "product-filter-body"
                }
              >
                <div className="product-filter-block">
                  <div className="product-filter-title">
                    <h3>Product Category</h3>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                  </div>

                  <div className="product-filter-stack">
                    {mainFilters.map((item) => {
                      const isActive = activeGroup === item;
                      const isOpen = openGroup === item;
                      const hasSubFilter = item !== "All Items";
                      const subCategoryFilters = getSubCategoriesByGroup(item);

                      return (
                        <div
                          className={
                            isOpen
                              ? "product-category-item open"
                              : "product-category-item"
                          }
                          key={item}
                        >
                          <button
                            type="button"
                            className={
                              isActive
                                ? hasSubFilter
                                  ? "product-stack-filter active"
                                  : "product-stack-filter active no-sub"
                                : hasSubFilter
                                ? "product-stack-filter"
                                : "product-stack-filter no-sub"
                            }
                            onClick={() => handleGroupClick(item)}
                          >
                            <span>{item}</span>
                            <small>{groupCount(item)}</small>

                            {hasSubFilter && (
                              <em
                                role="button"
                                tabIndex={0}
                                aria-label={`Toggle ${item} sub categories`}
                                onClick={(event) =>
                                  handleArrowClick(event, item)
                                }
                                onKeyDown={(event) => {
                                  if (event.key === "Enter") {
                                    handleArrowClick(event, item);
                                  }
                                }}
                              >
                                <ion-icon
                                  name={
                                    isOpen
                                      ? "chevron-down-outline"
                                      : "chevron-forward-outline"
                                  }
                                ></ion-icon>
                              </em>
                            )}
                          </button>

                          {isOpen && hasSubFilter && (
                            <div className="product-inline-sub-filter">
                              {subCategoryFilters.map((subCategory) => (
                                <button
                                  type="button"
                                  className={
                                    activeSubCategory === subCategory
                                      ? "product-sub-filter active"
                                      : "product-sub-filter"
                                  }
                                  key={subCategory}
                                  onClick={(event) =>
                                    handleSubCategoryClick(
                                      event,
                                      item,
                                      subCategory
                                    )
                                  }
                                >
                                  <span>{subCategory}</span>
                                  <small>
                                    {subCategoryCount(item, subCategory)}
                                  </small>
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="product-filter-divider"></div>

                <div className="product-filter-block">
                  <div className="product-filter-title">
                    <h3>Price range</h3>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                  </div>

                  <div className="product-price-inputs">
                    <label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={minPrice}
                        onChange={(event) => setMinPrice(event.target.value)}
                      />
                      <span>$</span>
                    </label>

                    <b>-</b>

                    <label>
                      <input
                        type="number"
                        min="0"
                        max="200"
                        value={maxPrice}
                        onChange={(event) => setMaxPrice(event.target.value)}
                      />
                      <span>$</span>
                    </label>
                  </div>

                  <div
                    className="product-range-control"
                    style={{
                      "--range-min": `${(Number(minPrice) / 120) * 100}%`,
                      "--range-max": `${(Number(maxPrice) / 120) * 100}%`,
                    }}
                  >
                    <input
                      type="range"
                      min="0"
                      max="120"
                      value={minPrice}
                      onChange={(event) => {
                        const value = Math.min(
                          Number(event.target.value),
                          Number(maxPrice) - 5
                        );
                        setMinPrice(value);
                      }}
                    />

                    <input
                      type="range"
                      min="0"
                      max="120"
                      value={maxPrice}
                      onChange={(event) => {
                        const value = Math.max(
                          Number(event.target.value),
                          Number(minPrice) + 5
                        );
                        setMaxPrice(value);
                      }}
                    />
                  </div>
                </div>

                <div className="product-filter-block">
                  <div className="product-filter-title">
                    <h3>Ratings</h3>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                  </div>

                  <div className="product-rating-options">
                    <button
                      type="button"
                      className={
                        Number(rating) === 0
                          ? "product-rating-option active"
                          : "product-rating-option"
                      }
                      onClick={handleClearRating}
                    >
                      <span className="rating-radio"></span>
                      <strong>All Ratings</strong>
                    </button>

                    {[5, 4, 3, 2].map((starCount) => (
                      <button
                        type="button"
                        className={
                          Number(rating) === Number(starCount)
                            ? "product-rating-option active"
                            : "product-rating-option"
                        }
                        key={starCount}
                        onClick={(event) => handleRatingClick(event, starCount)}
                      >
                        <span className="rating-radio"></span>

                        <div className="rating-stars">
                          {renderStars(starCount)}
                        </div>

                        {starCount < 5 && <small>& up</small>}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  className="product-apply-btn"
                  onClick={handleApplyFilter}
                >
                  Apply Filter
                </button>
              </div>
            </aside>

            <div className="product-listing-main">
              <div className="product-listing-toolbar">
                <div className="product-view-actions">
                  <button
                    type="button"
                    className={
                      viewMode === "grid"
                        ? "product-view-btn active"
                        : "product-view-btn"
                    }
                    onClick={() => setViewMode("grid")}
                    aria-label="Grid view"
                  >
                    <ion-icon name="grid-outline"></ion-icon>
                  </button>

                  <button
                    type="button"
                    className={
                      viewMode === "list"
                        ? "product-view-btn active"
                        : "product-view-btn"
                    }
                    onClick={() => setViewMode("list")}
                    aria-label="List view"
                  >
                    <ion-icon name="list-outline"></ion-icon>
                  </button>
                </div>

                <div className="product-sort-box">
                  <span>Sort by :</span>

                  <select
                    value={sortBy}
                    onChange={(event) => setSortBy(event.target.value)}
                  >
                    {sortOptions.map((option) => (
                      <option value={option.value} key={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="product-applied-row">
                <span>Filters applied :</span>

                {sortBy === "newest" ? (
                  <button type="button">Newest</button>
                ) : (
                  <>
                    <button type="button">{activeGroup}</button>

                    {activeSubCategory !== "All" && (
                      <button type="button">{activeSubCategory}</button>
                    )}

                    {Number(rating) > 0 && (
                      <button type="button">{rating} stars & up</button>
                    )}
                  </>
                )}

                <small>{filteredProducts.length} products found</small>
              </div>

              {filteredProducts.length > 0 ? (
                <div className={productGridClass}>
                  {filteredProducts.map((product) => {
                    const productPill = getProductPill(product);
                    const shouldShowPill = Boolean(productPill);

                    return (
                      <article
                        className="product-card"
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                      >
                        <div className="product-image-box">
                          {shouldShowPill && (
                            <span
                              className={`product-image-pill ${normalizeText(
                                productPill
                              )}`}
                            >
                              {productPill}
                            </span>
                          )}

                          <img src={product.image} alt={product.title} />
                        </div>

                        <div className="product-card-content">
                          <div className="product-card-meta">
                            <span>{product.group}</span>
                            <span>{product.subCategory}</span>
                          </div>

                          <h3>{product.title}</h3>
                          <p>by {product.author}</p>

                          <div className="product-card-bottom-row">
                            <div className="product-card-stars">
                              {renderStars(product.rating)}
                            </div>

                            <strong>${product.price}</strong>
                          </div>

                          <button
                            type="button"
                            className="product-add-cart-btn"
                            onClick={(event) =>
                              handleAddToCart(event, product)
                            }
                          >
                            <ion-icon name="cart-outline"></ion-icon>
                            Add to Cart
                          </button>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="product-empty-state">
                  <h3>No products found</h3>
                  <p>Try changing search, category, price range, or rating.</p>
                  <button type="button" onClick={handleResetFilter}>
                    Reset Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <JoinOpportunity onJoinClick={onJoinClick} />
    </main>
  );
}

export default Product;