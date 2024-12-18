// Filters.js
import React from 'react';

const Filters = ({
  filtersVisible,
  toggleFilters,
  selectedRestaurant,
  setSelectedRestaurant,
  selectedCategory,
  setSelectedCategory,
  selectedFoodType,
  setSelectedFoodType,
  selectedPriceSort,
  setSelectedPriceSort,
  selectedRating,
  setSelectedRating,
  restaurants,
  categories,
  foodTypes
}) => {
  return (
    <div>
      <button className="btn btn-secondary filter-button" onClick={toggleFilters}>
        {filtersVisible ? 'Hide Filters' : 'Show Filters'}
      </button>
      {filtersVisible && (
        <div className="filters-card">
          <div className="filter-dropdowns d-flex justify-content-between">
            {/* Restaurant filter */}
            <div className="filter-dropdown">
              <label htmlFor="restaurant-select">Restaurant:</label>
              <select
                id="restaurant-select"
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="rounded"
              >
                <option value="All">All</option>
                {restaurants.map((rest) => (
                  <option key={rest.name} value={rest.name}>{rest.name}</option>
                ))}
              </select>
            </div>

            {/* Category filter */}
            <div className="filter-dropdown">
              <label htmlFor="category-select">Category:</label>
              <select
                id="category-select"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="rounded"
              >
                <option value="All">All</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Food Type filter */}
            <div className="filter-dropdown">
              <label htmlFor="foodtype-select">Food Type:</label>
              <select
                id="foodtype-select"
                value={selectedFoodType}
                onChange={(e) => setSelectedFoodType(e.target.value)}
                className="rounded"
              >
                {foodTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Price Sort filter */}
            <div className="filter-dropdown">
              <label htmlFor="price-sort-select">Sort by Price:</label>
              <select
                id="price-sort-select"
                value={selectedPriceSort}
                onChange={(e) => setSelectedPriceSort(e.target.value)}
                className="rounded"
              >
                <option value="none">None</option>
                <option value="lowToHigh">Low to High</option>
                <option value="highToLow">High to Low</option>
              </select>
            </div>

            {/* Rating filter */}
            <div className="filter-dropdown">
              <label htmlFor="rating-select">Rating:</label>
              <select
                id="rating-select"
                value={selectedRating}
                onChange={(e) => setSelectedRating(e.target.value)}
                className="rounded"
              >
                <option value="All">All</option>
                <option value="4">Above 4</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Filters;
