import mongoose from 'mongoose';
import crypto from 'crypto';

function generateBookingReference() {
  return 'SKY' + crypto.randomBytes(4).toString('hex').toUpperCase(); // e.g., SKY7F2A8D4B
}

const bookingSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    flight_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Flight',
      required: true
    },
    passenger_name: {
      type: String,
      required: true,
      trim: true
    },
    passenger_email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true
    },
    passenger_phone: {
      type: String,
      required: true,
      trim: true
    },
    seat_number: {
      type: String,
      trim: true
    },
    seat_preference: {
      type: String,
      enum: ['window', 'aisle', 'middle'],
      default: 'window'
    },
    meal_preference: {
      type: String,
      enum: ['regular', 'vegetarian', 'vegan', 'kosher', 'halal'],
      default: 'regular'
    },
    booking_reference: {
      type: String,
      unique: true,
      default: generateBookingReference // ✅ No need for required: true
    },
    status: {
      type: String,
      enum: ['confirmed', 'cancelled', 'pending'],
      default: 'pending'
    },
    total_amount: {
      type: Number,
      required: true,
      min: 0
    },
    payment_status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

// Indexes for better performance
bookingSchema.index({ user_id: 1, status: 1 });
bookingSchema.index({ booking_reference: 1 });

export const Booking = mongoose.model('Booking', bookingSchema);
export default Booking;
