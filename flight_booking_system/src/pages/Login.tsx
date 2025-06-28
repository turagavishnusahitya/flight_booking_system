import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Plane, Eye, EyeOff, Mail, Lock } from 'lucide-react';
import RecursiveButton from '../components/ui/RecursiveButton';
import RecursiveCard from '../components/ui/RecursiveCard';
import ProfessionalInput from '../components/ui/ProfessionalInput';

interface FlightData {
  from: string;
  to: string;
  date: string;
  // Add any other expected flight data fields
}

const Login: React.FC = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo ?? null;
  const flightData = location.state?.flightData as FlightData | undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);

      if (returnTo === '/booking' && flightData) {
        navigate('/booking', { state: flightData });
      } else {
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-2xl">
              <Plane className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Welcome back</h2>
          <p className="text-gray-600 text-lg">
            {returnTo === '/booking' ? 'Sign in to complete your booking' : 'Sign in to continue your journey'}
          </p>
        </div>

        {returnTo === '/booking' && (
          <RecursiveCard className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
            <p className="text-blue-800 text-center font-semibold">
              🎯 Complete your flight booking after signing in!
            </p>
          </RecursiveCard>
        )}

        <RecursiveCard>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            <ProfessionalInput
              id="email"
              label="Email address"
              type="email"
              icon={Mail}
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                <Lock className="inline w-4 h-4 mr-2 text-gray-500" />
                Password <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  className="input-professional pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Toggle password visibility"
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
              {loading ? 'Signing in...' : 'Sign in'}
            </RecursiveButton>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                state={location.state}
                className="text-blue-600 hover:text-blue-700 font-semibold"
              >
                Sign up
              </Link>
            </p>
          </div>
        </RecursiveCard>

        <RecursiveCard padding="sm">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Demo Credentials</h3>
          <div className="text-sm text-gray-600 space-y-2">
            <div className="flex justify-between items-center">
              <span>
                <strong className="text-blue-600">Admin:</strong> admin@skybook.com
              </span>
              <span className="text-blue-600">admin123</span>
            </div>
            <div className="flex justify-between items-center">
              <span>
                <strong className="text-green-600">User:</strong> user@skybook.com
              </span>
              <span className="text-green-600">user123</span>
            </div>
          </div>
        </RecursiveCard>
      </div>
    </div>
  );
};

export default Login;
