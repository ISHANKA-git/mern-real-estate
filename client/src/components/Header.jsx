import { FaSearch, FaBars } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useEffect, useState } from 'react';

export default function Header() {
  const { currentUser } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    navigate(`/search?${searchQuery}`);
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [location.search]);
  return (
    <header className="bg-white shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto py-4 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/">
          <h1 className="font-extrabold text-lg sm:text-2xl text-slate-900 flex items-center">
            <span className="text-blue-600">Home</span>
            <span className="text-slate-900">Horizon</span>
          </h1>
        </Link>

        {/* Search Bar for Medium and Larger Screens */}
        <form
          onSubmit={handleSubmit}
          className="hidden sm:flex items-center border rounded-full px-3 py-2 bg-gray-100"
        >
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-32 sm:w-64 text-sm text-slate-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="text-blue-600">
            <FaSearch className="h-5 w-5" />
          </button>
        </form>

        {/* Navigation Links for Medium and Larger Screens */}
        <ul className="hidden sm:flex items-center gap-6">
          <Link to="/">
            <li className="text-slate-900 font-medium hover:text-blue-600 transition-colors duration-200">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-slate-900 font-medium hover:text-blue-600 transition-colors duration-200">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover border-2 border-blue-600"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-900 font-medium hover:text-blue-600 transition-colors duration-200">
                Sign in
              </li>
            )}
          </Link>
        </ul>

        {/* Mobile Menu Icon */}
        <div className="sm:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-slate-900">
            <FaBars className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="bg-white py-4 ">
  <form
    onSubmit={handleSubmit}
    className="flex sm:hidden items-center border rounded-full px-3 py-2 bg-gray-100 mx-4"
  >
    <input
      type="text"
      placeholder="Search..."
      className="bg-transparent focus:outline-none w-full text-sm text-slate-700"
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
    <button className="text-blue-600">
      <FaSearch className="h-5 w-5" />
    </button>
  </form>
</div>


      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <ul className="sm:hidden bg-white border-t border-gray-200 px-4 py-4 space-y-4">
          <Link to="/">
            <li className="text-slate-900 font-medium hover:text-blue-600 transition-colors duration-200">
              Home
            </li>
          </Link>
          <Link to="/about">
            <li className="text-slate-900 font-medium hover:text-blue-600 transition-colors duration-200">
              About
            </li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img
                className="rounded-full h-8 w-8 object-cover border-2 border-blue-600"
                src={currentUser.avatar}
                alt="profile"
              />
            ) : (
              <li className="text-slate-900 font-medium hover:text-blue-600 transition-colors duration-200">
                Sign in
              </li>
            )}
          </Link>
        </ul>
      )}
    </header>


  );
}