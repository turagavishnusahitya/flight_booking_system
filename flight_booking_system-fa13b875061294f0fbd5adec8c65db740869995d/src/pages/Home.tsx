import React, { useState } from 'react';
import { Search, MapPin, Calendar, Users, ArrowRight, Plane, Shield, Clock, Star, Globe, Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RecursiveButton from '../components/ui/RecursiveButton';
import RecursiveCard from '../components/ui/RecursiveCard';
import ProfessionalInput from '../components/ui/ProfessionalInput';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    origin: '',
    destination: '',
    departure_date: '',
    passengers: 1,
  });

  const handleSearch = () => {
    if (searchData.origin && searchData.destination && searchData.departure_date) {
      navigate('/flights', { state: searchData });
    }
  };

  const handleDestinationClick = (destination: string) => {
    setSearchData({ ...searchData, destination });
    if (!user) {
      // Allow guest users to search flights
      navigate('/flights', { state: { ...searchData, destination } });
    } else {
      navigate('/flights', { state: { ...searchData, destination } });
    }
  };

  const features = [
    {
      icon: Globe,
      title: "Global Network",
      description: "Access to 500+ airlines across 200+ countries worldwide",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Shield,
      title: "Secure Booking",
      description: "Military-grade encryption for all your transactions",
      color: "from-green-500 to-green-600"
    },
    {
      icon: Clock,
      title: "24/7 Support",
      description: "Round-the-clock premium customer assistance",
      color: "from-purple-500 to-purple-600"
    },
    {
      icon: Award,
      title: "Best Prices",
      description: "Guaranteed lowest prices with price match promise",
      color: "from-orange-500 to-orange-600"
    }
  ];

  const destinations = [
    { 
      city: 'New York', 
      country: 'USA', 
      image: 'https://images.pexels.com/photos/290386/pexels-photo-290386.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 'from $299'
    },
    { 
      city: 'London', 
      country: 'UK', 
      image: 'https://images.pexels.com/photos/460672/pexels-photo-460672.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 'from $399'
    },
    { 
      city: 'Tokyo', 
      country: 'Japan', 
      image: 'https://images.pexels.com/photos/2614818/pexels-photo-2614818.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 'from $599'
    },
    { 
      city: 'Paris', 
      country: 'France', 
      image: 'https://images.pexels.com/photos/338515/pexels-photo-338515.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 'from $349'
    },
    { 
      city: 'Dubai', 
      country: 'UAE', 
      image: 'https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 'from $499'
    },
    { 
      city: 'Sydney', 
      country: 'Australia', 
      image: 'https://images.pexels.com/photos/995765/pexels-photo-995765.jpeg?auto=compress&cs=tinysrgb&w=800',
      price: 'from $799'
    },
  ];

  return (
    <div className="space-y-20">
      {/* Hero Section */}
      <section className="text-center py-20 relative">
        <div className="max-w-6xl mx-auto relative z-10">
          <div className="mb-8 animate-fade-in-up">
            <div className="inline-flex items-center space-x-2 bg-blue-50 px-6 py-3 rounded-full mb-6 border border-blue-200">
              <Star className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800 font-semibold">Professional Flight Experience</span>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-gray-900 animate-fade-in-up">
            Discover Your
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Next Adventure
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-600 mb-16 max-w-3xl mx-auto leading-relaxed animate-fade-in-up">
            Embark on extraordinary journeys with our professional flight booking platform. 
            Compare prices, discover destinations, and create unforgettable memories.
          </p>

          {/* Guest Access Notice */}
          {!user && (
            <div className="mb-8">
              <RecursiveCard className="max-w-2xl mx-auto bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
                <div className="flex items-center justify-center space-x-3">
                  <Star className="h-6 w-6 text-green-600" />
                  <p className="text-green-800 font-semibold">
                    🎉 Browse flights as a guest! Sign up to complete bookings.
                  </p>
                </div>
              </RecursiveCard>
            </div>
          )}

          {/* Search Card */}
          <RecursiveCard className="max-w-6xl mx-auto animate-fade-in-up">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <ProfessionalInput
                label="From"
                icon={MapPin}
                placeholder="Origin city"
                value={searchData.origin}
                onChange={(e) => setSearchData({ ...searchData, origin: e.target.value })}
              />

              <ProfessionalInput
                label="To"
                icon={MapPin}
                placeholder="Destination city"
                value={searchData.destination}
                onChange={(e) => setSearchData({ ...searchData, destination: e.target.value })}
              />

              <ProfessionalInput
                label="Departure"
                icon={Calendar}
                type="date"
                value={searchData.departure_date}
                onChange={(e) => setSearchData({ ...searchData, departure_date: e.target.value })}
              />

              <div className="space-y-2">
                <label className="block text-sm font-semibold text-gray-700">
                  <Users className="inline w-4 h-4 mr-2 text-gray-500" />
                  Passengers
                </label>
                <select
                  value={searchData.passengers}
                  onChange={(e) => setSearchData({ ...searchData, passengers: parseInt(e.target.value) })}
                  className="input-professional"
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <RecursiveButton
                  variant="primary"
                  size="lg"
                  icon={Search}
                  onClick={handleSearch}
                  className="w-full"
                >
                  Search Flights
                </RecursiveButton>
              </div>
            </div>
          </RecursiveCard>

          {/* Quick Actions for Logged In Users */}
          {user && (
            <div className="mt-8 flex justify-center space-x-4">
              <RecursiveButton
                variant="secondary"
                onClick={() => navigate('/flights')}
                icon={Plane}
              >
                Browse All Flights
              </RecursiveButton>
              <RecursiveButton
                variant="success"
                onClick={() => navigate('/dashboard')}
                icon={Calendar}
              >
                My Bookings
              </RecursiveButton>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">SkyBooker</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the future of flight booking with our cutting-edge platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <RecursiveCard key={index} className="text-center animate-fade-in-up" hover>
                <div className={`bg-gradient-to-r ${feature.color} p-4 rounded-2xl mb-6 w-fit mx-auto`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </RecursiveCard>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Destinations */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Popular <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Destinations</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover the world's most breathtaking destinations with exclusive deals
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className="relative group cursor-pointer overflow-hidden rounded-2xl card-recursive"
                onClick={() => handleDestinationClick(destination.city)}
              >
                <img
                  src={destination.image}
                  alt={destination.city}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    // Fallback image if the original fails to load
                    const target = e.target as HTMLImageElement;
                    target.src = `https://images.pexels.com/photos/1707820/pexels-photo-1707820.jpeg?auto=compress&cs=tinysrgb&w=800`;
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-2xl font-bold text-white mb-1">{destination.city}</h3>
                      <p className="text-white/90 mb-2">{destination.country}</p>
                      <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
                        {destination.price}
                      </span>
                    </div>
                    <RecursiveButton
                      variant="primary"
                      size="sm"
                      icon={ArrowRight}
                      className="bg-white/20 backdrop-blur-sm hover:bg-white/30"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;