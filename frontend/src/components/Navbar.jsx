import { useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchUsername, setSearchUsername] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  
  const { currentUser, logout, isAuthenticated } = useAuth();
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/login');
    closeMenu();
  };
  
  // Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchUsername.trim()) {
      navigate(`/portfolio/${searchUsername.trim()}`);
      setSearchUsername('');
      closeMenu();
    }
  };
  
  // Active link style
  const activeLink = "text-amber-600 font-semibold";
  const normalLink = "text-gray-600 hover:text-blue-700";
  
  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center" onClick={closeMenu}>
            <span className="text-2xl font-bold text-blue-900">Cardfolio</span>
          </Link>
          
          {/* Search Bar - Desktop */}
          <div className="hidden md:block w-1/3 mx-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                placeholder="Search by username..."
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                className="w-full py-1.5 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
              />
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </form>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink 
              to="/browse" 
              className={({ isActive }) => isActive ? activeLink : normalLink}
            >
              Browse
            </NavLink>
            
            {isAuthenticated && (
              <NavLink 
                to="/my-portfolio" 
                className={({ isActive }) => isActive ? activeLink : normalLink}
              >
                My Portfolio
              </NavLink>
            )}
            
            <a href="#" className={normalLink}>Marketplace</a>
            <a href="#" className={normalLink}>Blog</a>
          </div>
          
          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 focus:outline-none">
                  <img 
                    src={currentUser?.profileImage || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full border border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{currentUser?.username}</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                  <Link to="/my-portfolio" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Portfolio</Link>
                  <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                  <hr className="my-1" />
                  <button 
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-600 text-white hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-gray-500 focus:outline-none focus:text-gray-800"
            >
              {isMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden bg-white shadow-md ${isMenuOpen ? 'block' : 'hidden'}`}>
        {/* Mobile Search */}
        <div className="px-4 py-2">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search by username..."
              value={searchUsername}
              onChange={(e) => setSearchUsername(e.target.value)}
              className="w-full py-2 pl-10 pr-4 text-gray-700 bg-gray-100 rounded-md focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
            >
              <span className="text-sm text-blue-600 font-medium">Search</span>
            </button>
          </form>
        </div>
        
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink 
            to="/browse" 
            className={`block px-3 py-2 rounded-md ${location.pathname === '/browse' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            onClick={closeMenu}
          >
            Browse
          </NavLink>
          
          {isAuthenticated && (
            <NavLink 
              to="/my-portfolio" 
              className={`block px-3 py-2 rounded-md ${location.pathname === '/my-portfolio' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
              onClick={closeMenu}
            >
              My Portfolio
            </NavLink>
          )}
          
          <a 
            href="#" 
            className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={closeMenu}
          >
            Marketplace
          </a>
          <a 
            href="#" 
            className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
            onClick={closeMenu}
          >
            Blog
          </a>
        </div>
        
        {isAuthenticated ? (
          <div className="px-4 py-3 border-t border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <img 
                  src={currentUser?.profileImage || "https://randomuser.me/api/portraits/lego/1.jpg"} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full"
                />
              </div>
              <div className="ml-3">
                <div className="text-base font-medium text-gray-800">{currentUser?.name || currentUser?.username}</div>
                <div className="text-sm text-gray-500">@{currentUser?.username}</div>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              <Link 
                to="/my-portfolio" 
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={closeMenu}
              >
                My Portfolio
              </Link>
              <Link 
                to="/settings" 
                className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
                onClick={closeMenu}
              >
                Settings
              </Link>
              <button 
                onClick={handleLogout}
                className="block w-full text-left px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="px-4 py-3 border-t border-gray-200 space-y-1">
            <Link
              to="/login"
              className="block w-full px-3 py-2 rounded-md text-center text-gray-700 border border-gray-300 hover:bg-gray-50"
              onClick={closeMenu}
            >
              Log In
            </Link>
            <Link
              to="/register"
              className="block w-full px-3 py-2 rounded-md text-center text-white bg-blue-600 hover:bg-blue-700"
              onClick={closeMenu}
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;