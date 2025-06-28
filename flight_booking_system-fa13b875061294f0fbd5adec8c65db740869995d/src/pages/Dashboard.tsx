import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Calendar, Clock, MapPin, Plane, CreditCard, Settings, Users, BarChart3, TrendingUp, Award, X, AlertTriangle } from 'lucide-react';
import { bookingsAPI, flightsAPI, usersAPI } from '../lib/api';
import RecursiveCard from '../components/ui/RecursiveCard';
import RecursiveButton from '../components/ui/RecursiveButton';
import Badge from '../components/ui/Badge';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('bookings');
  const [bookings, setBookings] = useState<any[]>([]);
  const [flights, setFlights] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancellingBooking, setCancellingBooking] = useState<string | null>(null);

  const userTabs = [
    { id: 'bookings', label: 'My Bookings', icon: Calendar },
    { id: 'profile', label: 'Profile', icon: Settings },
  ];

  const adminTabs = [
    { id: 'flights', label: 'Manage Flights', icon: Plane },
    { id: 'bookings', label: 'All Bookings', icon: Calendar },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const tabs = user?.role === 'admin' ? adminTabs : userTabs;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch bookings
        const bookingsResponse = await bookingsAPI.getBookings();
        setBookings(bookingsResponse.bookings || []);

        // Fetch additional data for admin
        if (user?.role === 'admin') {
          const [flightsResponse, usersResponse] = await Promise.all([
            flightsAPI.getFlights(),
            usersAPI.getUsers()
          ]);
          setFlights(flightsResponse.flights || []);
          setUsers(usersResponse.users || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user]);

  const handleCancelBooking = async (bookingId: string) => {
    setCancellingBooking(bookingId);
    
    try {
      await bookingsAPI.cancelBooking(bookingId);
      
      // Update local state
      setBookings(bookings.map(booking => 
        booking._id === bookingId 
          ? { ...booking, status: 'cancelled' }
          : booking
      ));
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setCancellingBooking(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <RecursiveCard className="text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Welcome back, <span className="text-blue-600">{user?.full_name}</span>!
            </h1>
            <p className="text-gray-600 text-lg">
              {user?.role === 'admin' ? 'Manage your flight operations with ease' : 'Your professional travel dashboard'}
            </p>
          </div>
          <div className="mt-6 md:mt-0">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-2xl">
              <Plane className="h-12 w-12 text-white" />
            </div>
          </div>
        </div>
      </RecursiveCard>

      {/* Stats Cards */}
      {user?.role === 'admin' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <RecursiveCard hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Flights</p>
                <p className="text-2xl font-bold text-gray-900">{flights.length}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+12%</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                <Plane className="h-6 w-6 text-white" />
              </div>
            </div>
          </RecursiveCard>
          
          <RecursiveCard hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+8%</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </RecursiveCard>
          
          <RecursiveCard hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+25%</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
          </RecursiveCard>
          
          <RecursiveCard hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0).toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">+15%</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-orange-500 to-orange-600 p-3 rounded-xl">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </RecursiveCard>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <RecursiveCard hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                <div className="flex items-center mt-2">
                  <Award className="h-4 w-4 text-blue-500 mr-1" />
                  <span className="text-blue-500 text-sm">Professional</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
          </RecursiveCard>
          
          <RecursiveCard hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Upcoming Trips</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-green-500 text-sm">Confirmed</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                <Plane className="h-6 w-6 text-white" />
              </div>
            </div>
          </RecursiveCard>
          
          <RecursiveCard hover>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${bookings.reduce((sum, booking) => sum + (booking.total_amount || 0), 0).toLocaleString()}
                </p>
                <div className="flex items-center mt-2">
                  <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-green-500 text-sm">Savings</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                <CreditCard className="h-6 w-6 text-white" />
              </div>
            </div>
          </RecursiveCard>
        </div>
      )}

      {/* Tabs */}
      <RecursiveCard>
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-3 py-4 px-2 border-b-2 font-semibold text-sm transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'bookings' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">
                  {user?.role === 'admin' ? 'All Bookings' : 'My Bookings'}
                </h3>
                <RecursiveButton variant="primary">
                  {user?.role === 'admin' ? 'Export Data' : 'Book New Flight'}
                </RecursiveButton>
              </div>

              <div className="space-y-4">
                {bookings.length > 0 ? bookings.map((booking) => (
                  <RecursiveCard key={booking._id} hover>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                          <Plane className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">
                            {booking.flight_id?.flight_number || 'N/A'}
                          </p>
                          <p className="text-gray-600 flex items-center">
                            <MapPin className="h-4 w-4 mr-1" />
                            {booking.flight_id?.origin} → {booking.flight_id?.destination}
                          </p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                            <span className="flex items-center">
                              <Clock className="h-3 w-3 mr-1" />
                              {booking.flight_id && formatTime(booking.flight_id.departure_time)}
                            </span>
                            <span>Seat: {booking.seat_number}</span>
                            <span>Ref: {booking.booking_reference}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">${booking.total_amount}</p>
                        <div className="flex items-center text-sm text-gray-500">
                          <Clock className="h-4 w-4 mr-1" />
                          {formatDate(booking.createdAt)}
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <Badge
                          variant={
                            booking.status === 'confirmed' ? 'success' :
                            booking.status === 'pending' ? 'warning' : 'error'
                          }
                        >
                          {booking.status}
                        </Badge>
                        {booking.status === 'confirmed' && (
                          <RecursiveButton
                            variant="error"
                            size="sm"
                            icon={cancellingBooking === booking._id ? undefined : X}
                            loading={cancellingBooking === booking._id}
                            onClick={() => handleCancelBooking(booking._id)}
                          >
                            {cancellingBooking === booking._id ? 'Cancelling...' : 'Cancel'}
                          </RecursiveButton>
                        )}
                      </div>
                    </div>
                  </RecursiveCard>
                )) : (
                  <div className="text-center py-16 text-gray-500">
                    <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                    <p className="text-xl">No bookings found</p>
                    <p className="text-gray-400 mt-2">Start your journey by booking your first flight</p>
                    <RecursiveButton
                      variant="primary"
                      className="mt-6"
                      onClick={() => window.location.href = '/'}
                    >
                      Book Your First Flight
                    </RecursiveButton>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-8">
              <h3 className="text-xl font-bold text-gray-900">Profile Settings</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={user?.full_name || ''}
                    readOnly
                    className="input-professional bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={user?.email || ''}
                    readOnly
                    className="input-professional bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Username
                  </label>
                  <input
                    type="text"
                    value={user?.username || ''}
                    readOnly
                    className="input-professional bg-gray-50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-gray-700">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={user?.phone || ''}
                    readOnly
                    className="input-professional bg-gray-50"
                  />
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <p className="text-blue-800">
                  Profile editing is disabled in demo mode. In a full application, you would be able to update your profile information here.
                </p>
              </div>
            </div>
          )}

          {activeTab === 'flights' && user?.role === 'admin' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900">Manage Flights</h3>
                <RecursiveButton variant="primary">
                  Add New Flight
                </RecursiveButton>
              </div>
              
              <div className="space-y-4">
                {flights.map((flight) => (
                  <RecursiveCard key={flight._id} hover>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                          <Plane className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{flight.flight_number}</p>
                          <p className="text-gray-600">{flight.airline}</p>
                          <p className="text-gray-600">
                            {flight.origin} → {flight.destination}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">${flight.price}</p>
                        <p className="text-gray-600">
                          {flight.available_seats}/{flight.total_seats} seats
                        </p>
                      </div>
                      <div className="flex space-x-2">
                        <RecursiveButton variant="secondary" size="sm">
                          Edit
                        </RecursiveButton>
                        <RecursiveButton variant="error" size="sm">
                          Delete
                        </RecursiveButton>
                      </div>
                    </div>
                  </RecursiveCard>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && user?.role === 'admin' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">User Management</h3>
              <div className="space-y-4">
                {users.map((user) => (
                  <RecursiveCard key={user._id} hover>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                          <Users className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-lg">{user.full_name}</p>
                          <p className="text-gray-600">{user.email}</p>
                          <p className="text-gray-600">@{user.username}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={user.role === 'admin' ? 'warning' : 'primary'}>
                          {user.role}
                        </Badge>
                        <p className="text-gray-600 text-sm mt-1">
                          {formatDate(user.createdAt)}
                        </p>
                      </div>
                    </div>
                  </RecursiveCard>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'analytics' && user?.role === 'admin' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900">Analytics Dashboard</h3>
              <div className="text-center py-16 text-gray-500">
                <BarChart3 className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                <p className="text-xl">Analytics dashboard</p>
                <p className="text-gray-400 mt-2">Comprehensive analytics and insights coming soon</p>
              </div>
            </div>
          )}
        </div>
      </RecursiveCard>
    </div>
  );
};

export default Dashboard;