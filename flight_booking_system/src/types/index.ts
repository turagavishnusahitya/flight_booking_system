export interface User {
  _id?: string;
  id?: string;
  email: string;
  username: string;
  role: 'user' | 'admin';
  full_name: string;
  phone?: string;
  created_at?: string;
  createdAt?: string;
}

export interface Flight {
  _id?: string;
  id?: string;
  flight_number: string;
  airline: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  price: number;
  available_seats: number;
  total_seats: number;
  aircraft_type: string;
  status?: 'active' | 'cancelled' | 'delayed';
  created_at?: string;
  createdAt?: string;
}

export interface Booking {
  _id?: string;
  id?: string;
  user_id: string;
  flight_id: string | Flight;
  passenger_name: string;
  passenger_email: string;
  passenger_phone: string;
  seat_number?: string;
  seat_preference?: 'window' | 'aisle' | 'middle';
  meal_preference?: 'regular' | 'vegetarian' | 'vegan' | 'kosher' | 'halal';
  booking_reference?: string;
  booking_date?: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  total_amount: number;
  payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
  flight?: Flight;
  user?: User;
  createdAt?: string;
  created_at?: string;
}

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  username: string;
  full_name: string;
  phone?: string;
}

export interface SearchFilters {
  origin: string;
  destination: string;
  departure_date: string;
  passengers: number;
  sort_by: 'price' | 'departure' | 'duration';
}