import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/flight_booking';

export const connectToDatabase = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('✅ Connected to MongoDB successfully');

    // 🌱 Seed data
    await seedInitialData();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

const seedInitialData = async () => {
  try {
    const User = (await import('../models/User.mjs')).default;
    const Flight = (await import('../models/Flight.mjs')).default;

    // Create admin if not exists
    const adminExists = await User.findOne({ email: 'admin@skybook.com' });
    if (!adminExists) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('admin123', 12);

      await User.create({
        email: 'admin@skybook.com',
        password: hashedPassword,
        username: 'admin',
        full_name: 'Admin User',
        phone: '+1 (555) 123-4567',
        role: 'admin',
      });

      console.log('👤 Admin user created');
    }

    // Create sample user if not exists
    const userExists = await User.findOne({ email: 'user@skybook.com' });
    if (!userExists) {
      const bcrypt = await import('bcryptjs');
      const hashedPassword = await bcrypt.default.hash('user123', 12);

      await User.create({
        email: 'user@skybook.com',
        password: hashedPassword,
        username: 'user',
        full_name: 'John Doe',
        phone: '+1 (555) 987-6543',
        role: 'user',
      });

      console.log('👤 Sample user created');
    }

    // Create sample flights if none exist
    const flightCount = await Flight.countDocuments();
    if (flightCount === 0) {
      const sampleFlights = [
        {
          flight_number: 'AA123',
          airline: 'American Airlines',
          origin: 'New York',
          destination: 'London',
          departure_time: new Date('2024-01-15T10:00:00Z'),
          arrival_time: new Date('2024-01-15T22:00:00Z'),
          price: 850,
          available_seats: 45,
          total_seats: 180,
          aircraft_type: 'Boeing 777',
        },
        {
          flight_number: 'BA456',
          airline: 'British Airways',
          origin: 'New York',
          destination: 'London',
          departure_time: new Date('2024-01-15T14:30:00Z'),
          arrival_time: new Date('2024-01-16T02:30:00Z'),
          price: 920,
          available_seats: 32,
          total_seats: 200,
          aircraft_type: 'Airbus A350',
        },
        {
          flight_number: 'UA789',
          airline: 'United Airlines',
          origin: 'New York',
          destination: 'London',
          departure_time: new Date('2024-01-15T18:45:00Z'),
          arrival_time: new Date('2024-01-16T06:45:00Z'),
          price: 780,
          available_seats: 67,
          total_seats: 220,
          aircraft_type: 'Boeing 787',
        },
        {
          flight_number: 'DL101',
          airline: 'Delta Airlines',
          origin: 'Los Angeles',
          destination: 'Tokyo',
          departure_time: new Date('2024-01-16T11:00:00Z'),
          arrival_time: new Date('2024-01-17T15:30:00Z'),
          price: 1200,
          available_seats: 28,
          total_seats: 250,
          aircraft_type: 'Boeing 777',
        },
        {
          flight_number: 'AF202',
          airline: 'Air France',
          origin: 'Paris',
          destination: 'New York',
          departure_time: new Date('2024-01-17T09:15:00Z'),
          arrival_time: new Date('2024-01-17T12:45:00Z'),
          price: 950,
          available_seats: 52,
          total_seats: 190,
          aircraft_type: 'Airbus A330',
        },
      ];

      await Flight.insertMany(sampleFlights);
      console.log('✈️ Sample flights created');
    }

    console.log('🌱 Database seeding completed');
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};
