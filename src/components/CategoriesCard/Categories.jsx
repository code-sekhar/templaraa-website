import React from "react";
import "./Categories.css";

import ecommerceImg from "../../assets/images/products/category-ecommerce.png";
import businessImg from "../../assets/images/products/category-business.png";
import portfolioImg from "../../assets/images/products/category-portfolio.png";
import entertainmentImg from "../../assets/images/products/category-entertainment.png";
import technologyImg from "../../assets/images/products/category-technology.png";
import studioImg from "../../assets/images/products/category-studio.png";

const categoryData = [
  {
    id: 1,
    title: "eCommerce Templates",
    category: "eCommerce",
    path: "/products?category=eCommerce",
    image: ecommerceImg,
    buttonText: "View More",
    tags: [
      { label: "Product Pages", count: 25 },
      { label: "Shop Layouts", count: 15 },
      { label: "Checkout", count: 12 },
      { label: "Cart UI", count: 8 },
      { label: "Payments", count: 5 },
    ],
  },
  {
    id: 2,
    title: "Business Websites",
    category: "Business",
    path: "/products?category=Business",
    image: businessImg,
    buttonText: "View More",
    tags: [
      { label: "Corporate", count: 22 },
      { label: "Agency", count: 18 },
      { label: "Startup", count: 14 },
      { label: "Services", count: 10 },
      { label: "Landing", count: 8 },
    ],
  },
  {
    id: 3,
    title: "Portfolio Designs",
    category: "Portfolio",
    path: "/products?category=Portfolio",
    image: portfolioImg,
    buttonText: "View More",
    tags: [
      { label: "Personal", count: 20 },
      { label: "Creative", count: 16 },
      { label: "Resume", count: 11 },
      { label: "Gallery", count: 9 },
      { label: "Case Study", count: 6 },
    ],
  },
  {
    id: 4,
    title: "Entertainment Pages",
    category: "Entertainment",
    path: "/products?category=Entertainment",
    image: entertainmentImg,
    buttonText: "View More",
    tags: [
      { label: "Events", count: 17 },
      { label: "Media", count: 15 },
      { label: "Streaming", count: 12 },
      { label: "Magazine", count: 8 },
      { label: "Blog", count: 6 },
    ],
  },
  {
    id: 5,
    title: "Technology Layouts",
    category: "Technology",
    path: "/products?category=Technology",
    image: technologyImg,
    buttonText: "View More",
    tags: [
      { label: "SaaS", count: 24 },
      { label: "AI Tools", count: 19 },
      { label: "Dashboard", count: 15 },
      { label: "Software", count: 11 },
      { label: "Cloud", count: 7 },
    ],
  },
  {
    id: 6,
    title: "Studio Templates",
    category: "Studio",
    path: "/products?category=Studio",
    image: studioImg,
    buttonText: "View More",
    tags: [
      { label: "Design Studio", count: 21 },
      { label: "Branding", count: 15 },
      { label: "Showcase", count: 12 },
      { label: "Photography", count: 8 },
      { label: "Creative", count: 6 },
    ],
  },
];

function Categories({ searchValue = "", onExploreCategory, onExploreMore }) {
  const filteredCategories = categoryData.filter((category) => {
    const searchText = searchValue.trim().toLowerCase();

    if (!searchText) {
      return true;
    }

    const titleMatch = category.title.toLowerCase().includes(searchText);

    const categoryMatch = category.category
      .toLowerCase()
      .includes(searchText);

    const tagMatch = category.tags.some((tag) =>
      tag.label.toLowerCase().includes(searchText)
    );

    return titleMatch || categoryMatch || tagMatch;
  });

  const handleExploreCategory = (category) => {
    if (onExploreCategory) {
      onExploreCategory(category);
    }
  };

  const handleExploreMore = () => {
    if (onExploreMore) {
      onExploreMore("/products");
    }
  };

  return (
    <section className="categories-section">
      <div className="container-fluid categories-container">
        <div className="categories-top">
          <div>
            <span className="section-label">OUR CATEGORIES</span>

            <h2>
              Dynamic dashboards to eCommerce,
              <br />
              company profiles, portfolios, and more.
            </h2>
          </div>

          <button
            type="button"
            className="explore-more-btn"
            onClick={handleExploreMore}
          >
            Explore More
          </button>
        </div>

        {filteredCategories.length > 0 ? (
          <div className="categories-grid">
            {filteredCategories.map((category, index) => (
              <div
                className="category-card"
                key={category.id}
                onClick={() => handleExploreCategory(category)}
              >
                <div className="category-card-content">
                  <h3>{category.title}</h3>

                  <div className="category-tags">
                    {category.tags.map((tag) => (
                      <span key={tag.label}>
                        {tag.label} ({tag.count})
                      </span>
                    ))}
                  </div>

                  <div className="category-divider-line">
                    <button
                      type="button"
                      className={
                        index === 0
                          ? "explore-card-btn active"
                          : "explore-card-btn"
                      }
                      onClick={(event) => {
                        event.stopPropagation();
                        handleExploreCategory(category);
                      }}
                    >
                      {category.buttonText}
                    </button>
                  </div>
                </div>

                <div className="category-image-box">
                  <img src={category.image} alt={category.title} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="category-empty">
            <h3>No category found</h3>
            <p>Try searching with another keyword.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Categories;