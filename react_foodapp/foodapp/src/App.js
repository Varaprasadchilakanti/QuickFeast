import './App.css';
import { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Cart from './Cart';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Account from './Account';
import Contact from './Contact';
import Filters from './Filters'; // Adjust the path based on your file structure


function App() {
  const [items, setItems] = useState([]);
  const [expandedItems, setExpandedItems] = useState({});
  const [cart, setCart] = useState({});
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  const [filtersVisible, setFiltersVisible] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] = useState('All');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedFoodType, setSelectedFoodType] = useState('All');
  const [selectedPriceSort, setSelectedPriceSort] = useState('none');
  const [selectedRating, setSelectedRating] = useState('All');

  // Options fetched from backend
  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [foodTypes, setFoodTypes] = useState(['All', 'Veg', 'Non-Veg']);
  
  useEffect(() => {
    // Fetch filter options from backend
    fetch('http://localhost:3002/filter-options')
      .then(resp => resp.json())
      .then(data => {
        setRestaurants(data.restaurants || []);
        setCategories(data.category || []); // Set categories state here
      })
      .catch(err => console.error('Failed to fetch filter options:', err));
  
    // Fetch filtered items based on the selected filter criteria
    fetchFilteredItems();
  }, [selectedRestaurant, selectedCategory, selectedFoodType, selectedPriceSort, selectedRating]);
  
  const fetchFilteredItems = () => {
    let url = `http://localhost:3002/items?restaurant=${selectedRestaurant}&category=${selectedCategory}&foodType=${selectedFoodType}&sortPrice=${selectedPriceSort}&rating=${selectedRating}`;
    fetch(url)
        .then(resp => resp.json())
        .then(data => setItems(data))
        .catch(err => console.error('Failed to fetch items:', err));
  };

  const handleReadMore = (id) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const addToCart = (itemId) => {
    setCart((prevCart) => ({
      ...prevCart,
      [itemId]: (prevCart[itemId] || 0) + 1,
    }));
  };

  const removeFromCart = (itemId) => {
    setCart((prevCart) => {
      const newCart = { ...prevCart };
      newCart[itemId] = Math.max(0, (newCart[itemId] || 0) - 1);
      if (newCart[itemId] === 0) {
        delete newCart[itemId];
      }
      return newCart;
    });
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  const toggleMenu = () => {
    window.scrollTo(0, 0);
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleFilters = () => {
    console.log("Filters toggled"); // Add this line
    setFiltersVisible(!filtersVisible);
  };  

  const handleLogout = () => {
    setIsLoggedIn(false); 
  };

  return (
    <Router>
      <div className={`App ${isDarkMode ? 'dark-theme' : ''}`}>
        <header className="App-header">
          <div className="menu-icon" onClick={toggleMenu}>
            <i className="fas fa-bars"></i>
          </div>
          <Link to="/" className="app-title">
            <h1>QuickFeast</h1>
          </Link>
          <div className="header-content">
            <i
              onClick={toggleDarkMode}
              className={`fas ${isDarkMode ? 'fa-sun' : 'fa-moon'} theme-icon`}
            />
            {/* Conditionally render Cart & Signout OR Login & Register */}
          {isLoggedIn ? (
            <>
              <Link to="/cart" className="cart-link">
                <button className='btn btn-info'>
                  {Object.keys(cart).length === 0 ? (
                    <i className="fas fa-shopping-cart" />
                  ) : (
                    `Cart (${Object.keys(cart).length})`
                  )}
                </button>
              </Link>
              <button className='btn btn-primary' onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i>
              </button>
            </>
          ) : (
            <div className="login-register">
              <Link to="/login">
                <button className='btn btn-outline-primary'>Sign In</button>
              </Link>
              <Link to="/register" className="ms-3">
                <button className='btn btn-outline-secondary'>Sign Up</button>
              </Link>
            </div>
          )}
          </div>
          {isMenuOpen && (
            <nav className="nav-menu">
              <ul>
                <li>
                  <Link to="/" onClick={toggleMenu}>
                    <i className="fas fa-home"></i> Home
                  </Link>
                </li>
                <li>
                  <Link to="/cart" onClick={toggleMenu}>
                    <i className="fas fa-shopping-cart"></i> Cart
                  </Link>
                </li>
                <li>
                  <Link to={isLoggedIn ? "/account" : "/login"} onClick={toggleMenu}>
                    <i className="fas fa-user"></i> Account
                  </Link>
                </li>
                <li>
                  <Link to="/contact" onClick={toggleMenu}>
                    <i className="fas fa-envelope"></i> Contact
                  </Link>
                </li>
              </ul>
            </nav>
          )}
        </header>
            
        <div className="content-area">
          <Routes>
            <Route path="/" element={
              <div>
                <Filters 
                  filtersVisible={filtersVisible}
                  toggleFilters={toggleFilters}
                  selectedRestaurant={selectedRestaurant}
                  setSelectedRestaurant={setSelectedRestaurant}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  selectedFoodType={selectedFoodType}
                  setSelectedFoodType={setSelectedFoodType}
                  selectedPriceSort={selectedPriceSort}
                  setSelectedPriceSort={setSelectedPriceSort}
                  selectedRating={selectedRating}
                  setSelectedRating={setSelectedRating}
                  restaurants={restaurants}
                  categories={categories}
                  foodTypes={foodTypes}
                />
              </div>
            } />
            {/* Other routes... */}
          </Routes>
        </div>

        {/* Main Content Area */}
        <div className="content-area">
          {/* Define Routes */}
          <Routes>
            <Route path="/" element={
              <div className="container mt-5">
                <div className="row">
                  {items && items.length > 0 &&
                    items.map(item => {
                      const itemCount = cart[item.id] || 0;
                      return (
                        <div className="col-md-4 col-sm-6 mb-4" key={item.id}>
                          <div className="card">
                            <img src={item.img} className="card-img-top" alt={item.name} />
                            <div className="card-body">
                              <h5 className='card-title'>{item.name}</h5>
                              <p className='card-text'>
                                {expandedItems[item.id]
                                  ? item.description
                                  : `${item.description.substring(0, 100)}...`}
                              </p>
                              <p className='card-text'>Category: {item.category}</p>
                              <div className="d-flex justify-content-between">
                                <p className='card-text'>Rating: {item.rating}</p>
                                <p className='card-text'>Price: ${item.price}</p>
                              </div>
                              <div className="button-container">
                                <button
                                  onClick={() => handleReadMore(item.id)}
                                  className='btn btn-primary me-2'>
                                  {expandedItems[item.id] ? 'Read Less' : 'Read More'}
                                </button>
                                <div className="counter-container">
                                  {itemCount === 0 ? (
                                    <button onClick={() => addToCart(item.id)} className='btn btn-light'>
                                      <i className="fas fa-shopping-cart"></i>
                                    </button>
                                  ) : (
                                    <>
                                      <button onClick={() => removeFromCart(item.id)} className='btn btn-warning'>-</button>
                                      <span>{itemCount}</span>
                                      <button onClick={() => addToCart(item.id)} className='btn btn-success'>+</button>
                                    </>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            } />
            <Route path="/cart" element={<Cart items={items} cart={cart} setCart={setCart} />} />
            <Route path="/login" element={<Login />} /> {/* Add login route */}
            <Route path="/register" element={<Register />} /> {/* Route for Register */}
            <Route path="/account" element={isLoggedIn ? <Account /> : <Navigate to="/login" />} />
            <Route path="/contact" element={<Contact />} /> {/* Add the Contact route */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
