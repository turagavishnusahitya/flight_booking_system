import express from 'express';
import { Booking } from '../models/Booking.js';
import Flight from '../models/Flight.mjs';
import User from '../models/User.mjs';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Helper function to generate a random booking reference
const generateBookingReference = () => {
  return 'BR' + Math.floor(100000 + Math.random() * 900000); // e.g., BR123456
};

// Get user bookings
router.get('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const query = user.role === 'admin' ? {} : { user_id: req.userId };

    const bookings = await Booking.find(query)
      .populate('flight_id')
      .populate('user_id', 'full_name email')
      .sort({ createdAt: -1 });

    res.json({ bookings });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const {
      flight_id,
      passenger_name,
      passenger_email,
      passenger_phone,
      seat_preference,
      meal_preference,
      passengers = 1
    } = req.body;

    const flight = await Flight.findById(flight_id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    if (flight.available_seats < passengers) {
      return res.status(400).json({ error: 'Not enough available seats' });
    }

    const baseAmount = flight.price * passengers;
    const taxesAndFees = 45;
    const total_amount = baseAmount + taxesAndFees;

    const seatNumber = `${Math.floor(Math.random() * 30) + 1}${['A', 'B', 'C', 'D', 'E', 'F'][Math.floor(Math.random() * 6)]}`;
    const booking_reference = generateBookingReference();

    const booking = new Booking({
      user_id: req.userId,
      flight_id,
      passenger_name,
      passenger_email,
      passenger_phone,
      seat_preference,
      meal_preference,
      seat_number: seatNumber,
      total_amount,
      booking_reference, // ✅ Include booking reference
      passengers,
      status: 'confirmed',
      payment_status: 'completed'
    });

    await booking.save();

    flight.available_seats -= passengers;
    await flight.save();

    await booking.populate('flight_id');

    res.status(201).json({
      message: 'Booking created successfully',
      booking
    });
  } catch (error) {
    console.error('Create booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booking by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('flight_id')
      .populate('user_id', 'full_name email');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const user = await User.findById(req.userId);
    if (user.role !== 'admin' && booking.user_id._id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    res.json({ booking });
  } catch (error) {
    console.error('Get booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel booking
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('flight_id');
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const user = await User.findById(req.userId);
    if (user.role !== 'admin' && booking.user_id.toString() !== req.userId) {
      return res.status(403).json({ error: 'Access denied' });
    }

    if (booking.status === 'cancelled') {
      return res.status(400).json({ error: 'Booking is already cancelled' });
    }

    booking.status = 'cancelled';
    booking.payment_status = 'refunded';
    await booking.save();

    const flight = await Flight.findById(booking.flight_id._id);
    if (flight) {
      flight.available_seats += booking.passengers || 1;
      await flight.save();
    }

    res.json({
      message: 'Booking cancelled successfully',
      booking
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Admin: Update booking status
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('flight_id');

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({
      message: 'Booking status updated successfully',
      booking
    });
  } catch (error) {
    console.error('Update booking status error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
