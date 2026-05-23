import { useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Product from "./pages/Product/Product";
import ProductDetails from "./pages/ProductDetails/ProductDetails";
import Cart from "./pages/Cart/Cart";

function App() {
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");
  const [cartItems, setCartItems] = useState([]);

  const handleNavChange = (item) => {
    navigate(item.path);
  };

  const handleCategoryChange = (category) => {
    navigate(`/products?category=${category}`);
  };

  const handleSearchChange = (value) => {
    setSearchValue(value);
  };

  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleHeroButtonClick = (button) => {
    navigate(button.path);
  };

  const handleExploreCategory = (category) => {
    navigate(category.path);
  };

  const handleExploreMore = (path) => {
    navigate(path);
  };

  const handleProductClick = ({ path, product }) => {
    navigate(path, {
      state: {
        product,
      },
    });
  };

  const handleRatingFilter = (rating) => {
    console.log("Rating filter selected:", rating);
  };

  const handleFilterChange = (filter) => {
    console.log("Recently filter selected:", filter);
  };

  const handleJoinClick = (path) => {
    navigate(path);
  };

  const handleFooterLinkClick = (link) => {
    navigate(link.path);
  };

  const handleSocialClick = (social) => {
    window.open(social.path, "_blank", "noopener,noreferrer");
  };

  const handleAddToCart = (product) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id
            ? {
                ...item,
                quantity: item.quantity + (product.quantity || 1),
              }
            : item
        );
      }

      return [
        ...prevItems,
        {
          ...product,
          quantity: product.quantity || 1,
        },
      ];
    });
  };

  const handleUpdateCartQuantity = (productId, type) => {
    setCartItems((prevItems) =>
      prevItems.map((item) => {
        if (item.id !== productId) {
          return item;
        }

        const currentQuantity = Number(item.quantity || 1);

        const nextQuantity =
          type === "increase" ? currentQuantity + 1 : currentQuantity - 1;

        return {
          ...item,
          quantity: Math.max(1, nextQuantity),
        };
      })
    );
  };

  const handleRemoveCartItem = (productId) => {
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== productId)
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((total, item) => {
    return total + Number(item.quantity || 1);
  }, 0);

  return (
    <>
      <Header
        cartCount={cartCount}
        onNavChange={handleNavChange}
        onCategoryChange={handleCategoryChange}
        onSearchChange={handleSearchChange}
        onCartClick={handleCartClick}
      />

      <Routes>
        <Route
          path="/"
          element={
            <Home
              searchValue={searchValue}
              onHeroButtonClick={handleHeroButtonClick}
              onExploreCategory={handleExploreCategory}
              onExploreMore={handleExploreMore}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onRatingFilter={handleRatingFilter}
              onFilterChange={handleFilterChange}
              onJoinClick={handleJoinClick}
            />
          }
        />

        <Route path="/about" element={<About />} />

        <Route
          path="/products"
          element={
            <Product
              searchValue={searchValue}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
              onRatingFilter={handleRatingFilter}
              onJoinClick={handleJoinClick}
            />
          }
        />

        <Route
          path="/products/:slug"
          element={<ProductDetails onAddToCart={handleAddToCart} />}
        />

        <Route
          path="/cart"
          element={
            <Cart
              cartItems={cartItems}
              onUpdateCartQuantity={handleUpdateCartQuantity}
              onRemoveCartItem={handleRemoveCartItem}
              onClearCart={handleClearCart}
            />
          }
        />
      </Routes>

      <Footer
        onFooterLinkClick={handleFooterLinkClick}
        onSocialClick={handleSocialClick}
      />
    </>
  );
}

export default App;