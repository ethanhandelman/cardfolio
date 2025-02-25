import { useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  
  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Close mobile menu
  const closeMenu = () => {
    setIsMenuOpen(false);
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
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex space-x-8">
            <NavLink 
              to="/browse" 
              className={({ isActive }) => isActive ? activeLink : normalLink}
            >
              Browse
            </NavLink>
            <NavLink 
              to="/my-portfolio" 
              className={({ isActive }) => isActive ? activeLink : normalLink}
            >
              My Portfolio
            </NavLink>
            <a href="#" className={normalLink}>Marketplace</a>
            <a href="#" className={normalLink}>Blog</a>
          </div>
          
          {/* User Menu (Desktop) */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative group">
              <button className="flex items-center space-x-1 focus:outline-none">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Profile" 
                  className="w-8 h-8 rounded-full border border-gray-300"
                />
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 hidden group-hover:block">
                <Link to="/my-portfolio" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Portfolio</Link>
                <Link to="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</Link>
                <hr className="my-1" />
                <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign Out</a>
              </div>
            </div>
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
        <div className="px-2 pt-2 pb-3 space-y-1">
          <NavLink 
            to="/browse" 
            className={`block px-3 py-2 rounded-md ${location.pathname === '/browse' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            onClick={closeMenu}
          >
            Browse
          </NavLink>
          <NavLink 
            to="/my-portfolio" 
            className={`block px-3 py-2 rounded-md ${location.pathname === '/my-portfolio' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'}`}
            onClick={closeMenu}
          >
            My Portfolio
          </NavLink>
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
        <div className="px-4 py-3 border-t border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <img 
                src="https://randomuser.me/api/portraits/men/32.jpg" 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
            </div>
            <div className="ml-3">
              <div className="text-base font-medium text-gray-800">Mike Johnson</div>
              <div className="text-sm text-gray-500">@card_collector94</div>
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
            <a 
              href="#" 
              className="block px-3 py-2 rounded-md text-gray-700 hover:bg-gray-50"
              onClick={closeMenu}
            >
              Sign Out
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;