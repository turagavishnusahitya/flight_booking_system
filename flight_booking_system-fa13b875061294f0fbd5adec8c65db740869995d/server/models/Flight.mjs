import mongoose from 'mongoose';

const flightSchema = new mongoose.Schema({
  flight_number: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  airline: {
    type: String,
    required: true,
    trim: true
  },
  origin: {
    type: String,
    required: true,
    trim: true
  },
  destination: {
    type: String,
    required: true,
    trim: true
  },
  departure_time: {
    type: Date,
    required: true
  },
  arrival_time: {
    type: Date,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  available_seats: {
    type: Number,
    required: true,
    min: 0
  },
  total_seats: {
    type: Number,
    required: true,
    min: 1
  },
  aircraft_type: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['active', 'cancelled', 'delayed'],
    default: 'active'
  }
}, {
  timestamps: true
});

// Index for search optimization
flightSchema.index({ origin: 1, destination: 1, departure_time: 1 });
flightSchema.index({ flight_number: 1 });

// ✅ Correct export
const Flight = mongoose.model('Flight', flightSchema);
export default Flight;
