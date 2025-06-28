export const mockUsers = [
  {
    id: '1',
    email: 'admin@skybook.com',
    username: 'admin',
    role: 'admin' as const,
    full_name: 'Admin User',
    phone: '+1 (555) 123-4567',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    email: 'user@skybook.com',
    username: 'user',
    role: 'user' as const,
    full_name: 'John Doe',
    phone: '+1 (555) 987-6543',
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockFlights = [
  {
    id: '1',
    flight_number: 'AA123',
    airline: 'American Airlines',
    origin: 'New York',
    destination: 'London',
    departure_time: '2024-01-15T10:00:00Z',
    arrival_time: '2024-01-15T22:00:00Z',
    price: 850,
    available_seats: 45,
    total_seats: 180,
    aircraft_type: 'Boeing 777',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    flight_number: 'BA456',
    airline: 'British Airways',
    origin: 'New York',
    destination: 'London',
    departure_time: '2024-01-15T14:30:00Z',
    arrival_time: '2024-01-16T02:30:00Z',
    price: 920,
    available_seats: 32,
    total_seats: 200,
    aircraft_type: 'Airbus A350',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    flight_number: 'UA789',
    airline: 'United Airlines',
    origin: 'New York',
    destination: 'London',
    departure_time: '2024-01-15T18:45:00Z',
    arrival_time: '2024-01-16T06:45:00Z',
    price: 780,
    available_seats: 67,
    total_seats: 220,
    aircraft_type: 'Boeing 787',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    flight_number: 'DL101',
    airline: 'Delta Airlines',
    origin: 'Los Angeles',
    destination: 'Tokyo',
    departure_time: '2024-01-16T11:00:00Z',
    arrival_time: '2024-01-17T15:30:00Z',
    price: 1200,
    available_seats: 28,
    total_seats: 250,
    aircraft_type: 'Boeing 777',
    created_at: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    flight_number: 'AF202',
    airline: 'Air France',
    origin: 'Paris',
    destination: 'New York',
    departure_time: '2024-01-17T09:15:00Z',
    arrival_time: '2024-01-17T12:45:00Z',
    price: 950,
    available_seats: 52,
    total_seats: 190,
    aircraft_type: 'Airbus A330',
    created_at: '2024-01-01T00:00:00Z'
  }
];

export const mockBookings = [
  {
    id: '1',
    user_id: '2',
    flight_id: '1',
    passenger_name: 'John Doe',
    passenger_email: 'john@example.com',
    passenger_phone: '+1 (555) 987-6543',
    seat_number: '12A',
    booking_date: '2024-01-10T10:00:00Z',
    status: 'confirmed' as const,
    total_amount: 895,
    flight: mockFlights[0]
  },
  {
    id: '2',
    user_id: '2',
    flight_id: '4',
    passenger_name: 'John Doe',
    passenger_email: 'john@example.com',
    passenger_phone: '+1 (555) 987-6543',
    seat_number: '8C',
    booking_date: '2024-01-12T14:30:00Z',
    status: 'pending' as const,
    total_amount: 1245,
    flight: mockFlights[3]
  }
];