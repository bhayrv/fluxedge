import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch, FaBell, FaCog, FaBars, FaUserCircle } from 'react-icons/fa';
import Logo from '../assets/FluxEdge_LogoMark.svg';

export default function Layout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [alerts, setAlerts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Profile', path: '/profile' },
    { name: 'Servers/Devices', path: '/servers' },
    { name: 'Network', path: '/network' },
    { name: 'Alerts/Incidents', path: '/alerts' },
    { name: 'Reports', path: '/reports' },
    { name: 'Settings', path: '/settings' },
  ];

  useEffect(() => {
    // Fetch latest alerts for the notification dropdown
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/alerts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          setAlerts(await res.json());
        }
      } catch (err) {
        console.error('Failed to fetch alerts:', err);
      }
    };
    fetchAlerts();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-sm">
      {/* Sidebar */}
      <aside
        className={`${
          isSidebarOpen ? 'block' : 'hidden'
        } lg:block w-64 bg-white border-r`}
      >
        <div className="h-16 flex items-center px-6 border-b">
          <img src={Logo} alt="FluxEdge Logo" className="h-10 w-10 mr-2" />
          <span className="text-xl font-bold">FluxEdge</span>
        </div>
        <nav className="flex-1 overflow-y-auto mt-4 px-4">
          <ul className="space-y-1 text-gray-700 font-medium">
            {menuItems.map((item) => (
              <li
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`py-2 px-3 rounded cursor-pointer ${
                  location.pathname === item.path
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-50'
                }`}
              >
                {item.name}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation Bar */}
        <header className="h-16 px-4 flex items-center justify-between bg-white border-b">
          {/* Hamburger Menu for Mobile */}
          <button
            className="lg:hidden text-gray-600"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            <FaBars size={20} />
          </button>

          {/* Search Bar */}
          <form
            onSubmit={handleSearch}
            className="relative flex-1 max-w-md mx-4"
          >
            <input
              type="text"
              placeholder="Search servers, logs…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-300 rounded pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </form>

          {/* User Controls */}
          <div className="flex items-center space-x-4">
            {/* Notification Bell */}
            <div className="relative">
              <FaBell
                size={20}
                className="text-gray-600 cursor-pointer"
                title="Notifications"
                onClick={() => navigate('/alerts')} // Navigate to alerts page
              />
              {alerts.length > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
                  {alerts.length}
                </span>
              )}
              {/* Dropdown */}
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 hidden group-hover:block">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="text-sm text-gray-700 border-b last:border-none py-1"
                  >
                    {alert.message}
                  </div>
                ))}
              </div>
            </div>

            {/* Settings Icon */}
            <FaCog
              size={20}
              className="text-gray-600 cursor-pointer"
              onClick={() => navigate('/settings')}
              title="Settings"
            />

            {/* Avatar */}
            <FaUserCircle
              size={24}
              className="text-gray-600 cursor-pointer"
              onClick={() => navigate('/profile')}
              title="Profile"
            />

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
