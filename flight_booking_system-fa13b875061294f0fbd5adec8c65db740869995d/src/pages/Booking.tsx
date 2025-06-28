import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plane, MapPin, Clock, Users, CreditCard, CheckCircle, Shield, Star } from 'lucide-react';
import { Flight } from '../types';
import { bookingsAPI } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import RecursiveCard from '../components/ui/RecursiveCard';
import RecursiveButton from '../components/ui/RecursiveButton';
import ProfessionalInput from '../components/ui/ProfessionalInput';

const Booking: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { flight, passengers } = location.state as { flight: Flight; passengers: number };
  
  const [step, setStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    passenger_name: user?.full_name || '',
    passenger_email: user?.email || '',
    passenger_phone: user?.phone || '',
    seat_preference: 'window',
    meal_preference: 'regular',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await bookingsAPI.createBooking({
        flight_id: flight._id || flight.id,
        passenger_name: bookingData.passenger_name,
        passenger_email: bookingData.passenger_email,
        passenger_phone: bookingData.passenger_phone,
        seat_preference: bookingData.seat_preference,
        meal_preference: bookingData.meal_preference,
        passengers: passengers
      });
      
      setBookingResult(response.booking);
      setStep(3);
    } catch (error: any) {
      console.error('Booking error:', error);
      setError(error.response?.data?.error || 'Booking failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const totalAmount = flight.price * passengers;

  if (step === 3 && bookingResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <RecursiveCard className="text-center">
          <div className="mb-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Booking <span className="text-green-600">Confirmed!</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Your professional flight experience awaits. Confirmation details have been sent to your email.
            </p>
          </div>

          <RecursiveCard className="mb-8" padding="sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center justify-center">
              <Star className="h-5 w-5 mr-2 text-blue-500" />
              Booking Details
            </h3>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between items-center">
                <span className="font-medium">Booking ID:</span>
                <span className="text-gray-900 font-bold">{bookingResult.booking_reference}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Flight:</span>
                <span className="text-gray-900 font-bold">{flight.flight_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Passenger:</span>
                <span className="text-gray-900 font-bold">{bookingData.passenger_name}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Seat:</span>
                <span className="text-gray-900 font-bold">{bookingResult.seat_number}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium">Total Amount:</span>
                <span className="text-gray-900 font-bold text-xl">${bookingResult.total_amount}</span>
              </div>
            </div>
          </RecursiveCard>

          <div className="flex space-x-4">
            <RecursiveButton
              variant="primary"
              onClick={() => navigate('/dashboard')}
              className="flex-1"
            >
              View My Bookings
            </RecursiveButton>
            <RecursiveButton
              variant="secondary"
              onClick={() => navigate('/')}
              className="flex-1"
            >
              Book Another Flight
            </RecursiveButton>
          </div>
        </RecursiveCard>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center space-x-4 mb-8">
        <RecursiveButton
          variant="secondary"
          icon={ArrowLeft}
          onClick={() => navigate(-1)}
          className="p-3" children={undefined}        />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Complete Your <span className="text-blue-600">Booking</span></h1>
          <p className="text-gray-600">Secure your professional flight experience</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <RecursiveCard>
            {/* Progress Steps */}
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <span className={`font-semibold ${
                  step >= 1 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Passenger Details
                </span>
              </div>
              <div className="flex-1 h-1 bg-gray-200 mx-6 rounded-full">
                <div className={`h-full bg-blue-600 rounded-full transition-all duration-500 ${
                  step >= 2 ? 'w-full' : 'w-0'
                }`}></div>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                  step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className={`font-semibold ${
                  step >= 2 ? 'text-gray-900' : 'text-gray-500'
                }`}>
                  Payment
                </span>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="text-red-600">{error}</p>
              </div>
            )}

            {step === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setStep(2); }} className="space-y-6">
                <ProfessionalInput
                  label="Full Name"
                  placeholder="Enter passenger's full name"
                  value={bookingData.passenger_name}
                  onChange={(e) => setBookingData({ ...bookingData, passenger_name: e.target.value })}
                  required
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <ProfessionalInput
                    label="Email Address"
                    type="email"
                    placeholder="email@example.com"
                    value={bookingData.passenger_email}
                    onChange={(e) => setBookingData({ ...bookingData, passenger_email: e.target.value })}
                    required
                  />
                  <ProfessionalInput
                    label="Phone Number"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={bookingData.passenger_phone}
                    onChange={(e) => setBookingData({ ...bookingData, passenger_phone: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Seat Preference
                    </label>
                    <select
                      value={bookingData.seat_preference}
                      onChange={(e) => setBookingData({ ...bookingData, seat_preference: e.target.value })}
                      className="input-professional"
                    >
                      <option value="window">Window</option>
                      <option value="aisle">Aisle</option>
                      <option value="middle">Middle</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-semibold text-gray-700">
                      Meal Preference
                    </label>
                    <select
                      value={bookingData.meal_preference}
                      onChange={(e) => setBookingData({ ...bookingData, meal_preference: e.target.value })}
                      className="input-professional"
                    >
                      <option value="regular">Regular</option>
                      <option value="vegetarian">Vegetarian</option>
                      <option value="vegan">Vegan</option>
                      <option value="kosher">Kosher</option>
                      <option value="halal">Halal</option>
                    </select>
                  </div>
                </div>

                <RecursiveButton
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                >
                  Continue to Payment
                </RecursiveButton>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex items-center space-x-3 mb-8">
                  <div className="bg-gradient-to-r from-green-500 to-green-600 p-3 rounded-xl">
                    <CreditCard className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Secure Payment</h3>
                  <Shield className="h-6 w-6 text-green-500" />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-8">
                  <p className="text-blue-800">
                    <strong>Demo Mode:</strong> This is a demonstration. No actual payment will be processed.
                  </p>
                </div>

                <ProfessionalInput
                  label="Card Number"
                  placeholder="1234 5678 9012 3456"
                  value="4111 1111 1111 1111"
                  required
                />

                <div className="grid grid-cols-2 gap-6">
                  <ProfessionalInput
                    label="Expiry Date"
                    placeholder="MM/YY"
                    value="12/25"
                    required
                  />
                  <ProfessionalInput
                    label="CVV"
                    placeholder="123"
                    value="123"
                    required
                  />
                </div>

                <ProfessionalInput
                  label="Cardholder Name"
                  placeholder="John Doe"
                  value={bookingData.passenger_name}
                  onChange={(e) => setBookingData({ ...bookingData, passenger_name: e.target.value })}
                  required
                />

                <div className="flex space-x-4">
                  <RecursiveButton
                    type="button"
                    variant="secondary"
                    onClick={() => setStep(1)}
                    className="flex-1"
                  >
                    Back
                  </RecursiveButton>
                  <RecursiveButton
                    type="submit"
                    variant="primary"
                    loading={loading}
                    className="flex-1"
                  >
                    {loading ? 'Processing...' : 'Complete Booking'}
                  </RecursiveButton>
                </div>
              </form>
            )}
          </RecursiveCard>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <RecursiveCard className="sticky top-8">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              <Star className="h-5 w-5 mr-2 text-blue-500" />
              Booking Summary
            </h3>
            
            <div className="space-y-6 mb-8">
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-3 rounded-xl">
                  <Plane className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-bold text-gray-900 text-lg">{flight.flight_number}</p>
                  <p className="text-gray-600">{flight.airline}</p>
                </div>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Date</span>
                  <span className="text-gray-900 font-medium">{formatDate(flight.departure_time)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Departure</span>
                  <span className="text-gray-900 font-medium">{formatTime(flight.departure_time)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Arrival</span>
                  <span className="text-gray-900 font-medium">{formatTime(flight.arrival_time)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Route</span>
                  <span className="text-gray-900 font-medium">{flight.origin} → {flight.destination}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Flight Price</span>
                <span className="text-gray-900">${flight.price}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Passengers</span>
                <span className="text-gray-900">{passengers}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Taxes & Fees</span>
                <span className="text-gray-900">$45</span>
              </div>
              <div className="border-t border-gray-200 pt-3">
                <div className="flex items-center justify-between text-lg font-bold">
                  <span className="text-gray-900">Total</span>
                  <span className="text-blue-600">${totalAmount + 45}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="flex items-center text-sm text-green-800">
                <Shield className="h-4 w-4 mr-2" />
                <span>Secure payment protected by 256-bit SSL encryption</span>
              </div>
            </div>
          </RecursiveCard>
        </div>
      </div>
    </div>
  );
};

export default Booking;