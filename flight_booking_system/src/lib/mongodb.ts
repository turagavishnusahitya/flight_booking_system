import { MongoClient, Db } from 'mongodb';

// MongoDB connection configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const MONGODB_DB = process.env.MONGODB_DB || 'flight_booking';

let client: MongoClient;
let db: Db;

export async function connectToDatabase() {
  if (db) {
    return { client, db };
  }

  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    db = client.db(MONGODB_DB);
    
    console.log('Connected to MongoDB');
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

export async function closeDatabaseConnection() {
  if (client) {
    await client.close();
    console.log('Disconnected from MongoDB');
  }
}

// Collections
export const collections = {
  users: 'users',
  flights: 'flights',
  bookings: 'bookings'
};

// Database operations
export class DatabaseService {
  private db: Db;

  constructor(database: Db) {
    this.db = database;
  }

  // User operations
  async createUser(userData: any) {
    const collection = this.db.collection(collections.users);
    const result = await collection.insertOne({
      ...userData,
      created_at: new Date(),
      updated_at: new Date()
    });
    return result;
  }

  async findUserByEmail(email: string) {
    const collection = this.db.collection(collections.users);
    return await collection.findOne({ email });
  }

  async findUserById(id: string) {
    const collection = this.db.collection(collections.users);
    return await collection.findOne({ _id: id });
  }

  // Flight operations
  async getAllFlights() {
    const collection = this.db.collection(collections.flights);
    return await collection.find({}).toArray();
  }

  async searchFlights(filters: any) {
    const collection = this.db.collection(collections.flights);
    const query: any = {};

    if (filters.origin) {
      query.origin = new RegExp(filters.origin, 'i');
    }
    if (filters.destination) {
      query.destination = new RegExp(filters.destination, 'i');
    }
    if (filters.departure_date) {
      const date = new Date(filters.departure_date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      query.departure_time = {
        $gte: date,
        $lt: nextDay
      };
    }

    return await collection.find(query).toArray();
  }

  async createFlight(flightData: any) {
    const collection = this.db.collection(collections.flights);
    const result = await collection.insertOne({
      ...flightData,
      created_at: new Date(),
      updated_at: new Date()
    });
    return result;
  }

  // Booking operations
  async createBooking(bookingData: any) {
    const collection = this.db.collection(collections.bookings);
    const result = await collection.insertOne({
      ...bookingData,
      booking_date: new Date(),
      created_at: new Date(),
      updated_at: new Date()
    });
    return result;
  }

  async getUserBookings(userId: string) {
    const collection = this.db.collection(collections.bookings);
    return await collection.find({ user_id: userId }).toArray();
  }

  async getAllBookings() {
    const collection = this.db.collection(collections.bookings);
    return await collection.find({}).toArray();
  }

  async updateBookingStatus(bookingId: string, status: string) {
    const collection = this.db.collection(collections.bookings);
    return await collection.updateOne(
      { _id: bookingId },
      { 
        $set: { 
          status, 
          updated_at: new Date() 
        } 
      }
    );
  }
}