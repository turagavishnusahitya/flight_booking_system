import React from 'react';
import { Plane, User, LogOut, Settings, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import RecursiveButton from '../ui/RecursiveButton';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  const handleDashboardClick = () => {
    navigate('/dashboard');
  };

  const handleFlightsClick = () => {
    navigate('/flights');
  };

  return (
    <header className="glass-card sticky top-0 z-50 border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div 
            className="flex items-center space-x-3 cursor-pointer group"
            onClick={handleLogoClick}
          >
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <Plane className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">
                SkyBooker
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Professional Flight Booking
              </span>
            </div>
          </div>

          {/* Navigation Menu */}
          <nav className="hidden md:flex items-center space-x-6">
            <RecursiveButton
              variant="secondary"
              onClick={handleFlightsClick}
              className="text-gray-700 hover:text-blue-600"
            >
              Browse Flights
            </RecursiveButton>
            {user && (
              <RecursiveButton
                variant="secondary"
                onClick={handleDashboardClick}
                className="text-gray-700 hover:text-blue-600"
              >
                My Dashboard
              </RecursiveButton>
            )}
          </nav>

          {user ? (
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gray-50 px-4 py-2 rounded-xl">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-400 rounded-full border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-gray-900">
                    {user.full_name}
                  </span>
                  {user.role === 'admin' && (
                    <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full font-medium">
                      Admin
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <RecursiveButton
                  variant="secondary"
                  size="sm"
                  icon={Bell}
                  className="p-2"
                />
                <RecursiveButton
                  variant="secondary"
                  size="sm"
                  icon={Settings}
                  onClick={handleDashboardClick}
                  className="p-2"
                />
                <RecursiveButton
                  variant="error"
                  size="sm"
                  icon={LogOut}
                  onClick={handleLogout}
                  className="p-2"
                />
              </div>
            </div>
          ) : (
            <div className="flex items-center space-x-3">
              <RecursiveButton
                variant="secondary"
                onClick={() => navigate('/login')}
              >
                Login
              </RecursiveButton>
              <RecursiveButton
                variant="primary"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </RecursiveButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;