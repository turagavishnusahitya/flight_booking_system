import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, Eye, EyeOff, User, Mail, Phone, Lock } from 'lucide-react';
import RecursiveButton from '../components/ui/RecursiveButton';
import RecursiveCard from '../components/ui/RecursiveCard';
import ProfessionalInput from '../components/ui/ProfessionalInput';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: '',
    full_name: '',
    phone: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo;
  const flightData = location.state?.flightData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await register(formData);
      if (returnTo === '/booking' && flightData) {
        navigate('/booking', { state: flightData });
      } else {
        navigate('/dashboard');
      }
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-2xl">
              <Plane className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Join SkyBooker</h2>
          <p className="text-gray-600 text-lg">
            {returnTo === '/booking'
              ? 'Create account to complete your booking'
              : 'Start your professional journey today'}
          </p>
        </div>

        {returnTo === '/booking' && (
          <RecursiveCard className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200">
            <div className="text-center">
              <p className="text-green-800 font-semibold">
                🚀 Join thousands of travelers! Create your account to book flights.
              </p>
            </div>
          </RecursiveCard>
        )}

        <RecursiveCard>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ProfessionalInput
                label="Full Name"
                icon={User}
                placeholder="John Doe"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
              />

              <ProfessionalInput
                label="Username"
                icon={User}
                placeholder="johndoe"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            <ProfessionalInput
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="john@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <ProfessionalInput
              label="Phone Number"
              type="tel"
              icon={Phone}
              placeholder="+1 (555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div className="space-y-2">
              <label className="block text-sm font-semibold text-gray-700">
                <Lock className="inline w-4 h-4 mr-2 text-gray-500" />
                Password
                <span className="text-red-500 ml-1">*</span>
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="input-professional pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>

            <RecursiveButton
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </RecursiveButton>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link 
                to="/login" 
                state={location.state}
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </RecursiveCard>
      </div>
    </div>
  );
};

export default Register;
