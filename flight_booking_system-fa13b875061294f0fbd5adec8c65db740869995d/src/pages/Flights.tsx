import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Search, Filter, Clock, MapPin, Plane, Users, ArrowRight, Star, Zap, LogIn } from 'lucide-react';
import { Flight, SearchFilters } from '../types';
import { flightsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import RecursiveCard from '../components/ui/RecursiveCard';
import RecursiveButton from '../components/ui/RecursiveButton';
import Badge from '../components/ui/Badge';

const Flights: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [flights, setFlights] = useState<Flight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState<SearchFilters>(
    location.state || {
      origin: '',
      destination: '',
      departure_date: '',
      passengers: 1,
      sort_by: 'price'
    }
  );

  useEffect(() => {
    const fetchFlights = async () => {
      setLoading(true);
      setError('');
      
      try {
        const params: any = {};
        
        if (filters.origin) params.origin = filters.origin;
        if (filters.destination) params.destination = filters.destination;
        if (filters.departure_date) params.departure_date = filters.departure_date;
        if (filters.sort_by) params.sort_by = filters.sort_by;
        
        const response = await flightsAPI.getFlights(params);
        setFlights(response.flights || []);
      } catch (error: any) {
        console.error('Error fetching flights:', error);
        setError('Failed to load flights. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchFlights();
  }, [filters]);

  const handleBookFlight = (flight: Flight) => {
    if (!user) {
      // Redirect to login with return path
      navigate('/login', { 
        state: { 
          returnTo: '/booking', 
          flightData: { flight, passengers: filters.passengers } 
        } 
      });
      return;
    }
    navigate('/booking', { state: { flight, passengers: filters.passengers } });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (departure: string, arrival: string) => {
    const dep = new Date(departure);
    const arr = new Date(arrival);
    const diff = arr.getTime() - dep.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <RecursiveCard className="text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            <p className="text-gray-600 font-medium">Searching for the best flights...</p>
          </div>
        </RecursiveCard>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <RecursiveCard className="text-center max-w-md">
          <div className="text-red-500 mb-4">
            <Plane className="h-16 w-16 mx-auto mb-4" />
            <h3 className="text-xl font-bold mb-2">Error Loading Flights</h3>
            <p>{error}</p>
          </div>
          <RecursiveButton
            variant="primary"
            onClick={() => window.location.reload()}
          >
            Try Again
          </RecursiveButton>
        </RecursiveCard>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Guest Access Notice */}
      {!user && (
        <RecursiveCard className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-3 rounded-xl">
                <LogIn className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Guest Mode Active</h3>
                <p className="text-gray-600">You can browse flights freely. Sign in to complete bookings.</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <RecursiveButton
                variant="secondary"
                onClick={() => navigate('/login')}
              >
                Sign In
              </RecursiveButton>
              <RecursiveButton
                variant="primary"
                onClick={() => navigate('/register')}
              >
                Sign Up
              </RecursiveButton>
            </div>
          </div>
        </RecursiveCard>
      )}

      {/* Search Header */}
      <RecursiveCard>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Available <span className="text-blue-600">Flights</span>
            </h1>
            <p className="text-gray-600">Find your perfect journey</p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={filters.sort_by}
              onChange={(e) => setFilters({ ...filters, sort_by: e.target.value as 'price' | 'departure' | 'duration' })}
              className="input-professional"
            >
              <option value="price">Sort by Price</option>
              <option value="departure">Sort by Departure</option>
              <option value="duration">Sort by Duration</option>
            </select>
            <RecursiveButton variant="secondary" icon={Filter}>
              Filters
            </RecursiveButton>
          </div>
        </div>

        <div className="flex items-center space-x-4 text-sm text-gray-600">
          <Badge variant="primary">
            <MapPin className="h-3 w-3 mr-1" />
            {filters.origin || 'Any'} → {filters.destination || 'Any'}
          </Badge>
          <Badge variant="success">
            <Clock className="h-3 w-3 mr-1" />
            {filters.departure_date || 'Any date'}
          </Badge>
          <Badge>
            <Users className="h-3 w-3 mr-1" />
            {filters.passengers} passenger{filters.passengers > 1 ? 's' : ''}
          </Badge>
        </div>
      </RecursiveCard>

      {/* Flight Results */}
      <div className="space-y-6">
        {flights.map((flight) => (
          <RecursiveCard key={flight._id || flight.id} hover>
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                      <Plane className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {flight.flight_number}
                      </h3>
                      <p className="text-gray-600">{flight.airline}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-yellow-600 text-sm font-medium">Premium Service</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      ${flight.price}
                    </p>
                    <p className="text-gray-600">per person</p>
                    <div className="flex items-center justify-end mt-1">
                      <Zap className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-green-600 text-sm">Best Deal</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">
                        {formatTime(flight.departure_time)}
                      </p>
                      <p className="text-gray-600 font-medium">{flight.origin}</p>
                    </div>
                    <div className="flex-1 flex items-center">
                      <div className="w-full border-t-2 border-gray-300 relative">
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-blue-500 p-2 rounded-full">
                          <ArrowRight className="h-3 w-3 text-white" />
                        </div>
                      </div>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-gray-900">
                        {formatTime(flight.arrival_time)}
                      </p>
                      <p className="text-gray-600 font-medium">{flight.destination}</p>
                    </div>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {formatDuration(flight.departure_time, flight.arrival_time)}
                    </p>
                    <p className="text-gray-600">Duration</p>
                    <Badge variant="primary" className="mt-1">
                      <Clock className="h-3 w-3 mr-1" />
                      Direct Flight
                    </Badge>
                  </div>

                  <div className="text-center">
                    <p className="text-lg font-bold text-gray-900">
                      {flight.available_seats}
                    </p>
                    <p className="text-gray-600">Seats Available</p>
                    <Badge variant="success" className="mt-1">
                      Premium Cabin
                    </Badge>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-6 text-sm text-gray-600">
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>{flight.aircraft_type}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>Economy Class</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span>Free Wi-Fi</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
                      <span>Meals Included</span>
                    </div>
                  </div>
                  <RecursiveButton
                    variant="primary"
                    size="lg"
                    onClick={() => handleBookFlight(flight)}
                    icon={user ? undefined : LogIn}
                  >
                    {user ? 'Select Flight' : 'Sign In to Book'}
                  </RecursiveButton>
                </div>
              </div>
            </div>
          </RecursiveCard>
        ))}
      </div>

      {flights.length === 0 && !loading && (
        <div className="text-center py-20">
          <RecursiveCard className="max-w-md mx-auto text-center">
            <Plane className="h-16 w-16 mx-auto text-gray-300 mb-6" />
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              No flights found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or check back later for new flights.
            </p>
            <RecursiveButton 
              variant="primary"
              onClick={() => navigate('/')}
            >
              Search Again
            </RecursiveButton>
          </RecursiveCard>
        </div>
      )}
    </div>
  );
};

export default Flights;