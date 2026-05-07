import Hero from "../../components/Hero/Hero";
import Categories from "../../components/CategoriesCard/Categories";
import NewArrival from "../../components/NewArrival/NewArrival";
import RecentlyAdded from "../../components/RecentlyAdded/RecentlyAdded";
import JoinOpportunity from "../../components/JoinOpportunity/JoinOpportunity";
import "./Home.css";

function Home({
  searchValue,
  onHeroButtonClick,
  onExploreCategory,
  onExploreMore,
  onProductClick,
  onAddToCart,
  onRatingFilter,
  onFilterChange,
  onJoinClick,
}) {
  return (
    <>
      <Hero onHeroButtonClick={onHeroButtonClick} />

      <Categories
        searchValue={searchValue}
        onExploreCategory={onExploreCategory}
        onExploreMore={onExploreMore}
      />

      <NewArrival
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
        onExploreMore={onExploreMore}
      />

      <RecentlyAdded
        searchValue={searchValue}
        onAddToCart={onAddToCart}
        onProductClick={onProductClick}
        onRatingFilter={onRatingFilter}
        onFilterChange={onFilterChange}
      />

      <JoinOpportunity onJoinClick={onJoinClick} />
    </>
  );
}

export default Home;