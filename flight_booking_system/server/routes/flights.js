import express from 'express';
import Flight from '../models/Flight.mjs';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// Get all flights with search and filtering
router.get('/', async (req, res) => {
  try {
    const {
      origin,
      destination,
      departure_date,
      sort_by = 'price',
      page = 1,
      limit = 10
    } = req.query;

    // Build search query
    const query = { status: 'active' };

    if (origin) {
      query.origin = new RegExp(origin, 'i');
    }

    if (destination) {
      query.destination = new RegExp(destination, 'i');
    }

    if (departure_date) {
      const date = new Date(departure_date);
      const nextDay = new Date(date);
      nextDay.setDate(date.getDate() + 1);
      
      query.departure_time = {
        $gte: date,
        $lt: nextDay
      };
    }

    // Build sort options
    let sortOptions = {};
    switch (sort_by) {
      case 'price':
        sortOptions = { price: 1 };
        break;
      case 'departure':
        sortOptions = { departure_time: 1 };
        break;
      case 'duration':
        sortOptions = { departure_time: 1 }; // Simplified for now
        break;
      default:
        sortOptions = { price: 1 };
    }

    // Execute query with pagination
    const flights = await Flight.find(query)
      .sort(sortOptions)
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Flight.countDocuments(query);

    res.json({
      flights,
      pagination: {
        current_page: parseInt(page),
        total_pages: Math.ceil(total / limit),
        total_flights: total,
        has_next: page * limit < total,
        has_prev: page > 1
      }
    });
  } catch (error) {
    console.error('Get flights error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get flight by ID
router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json({ flight });
  } catch (error) {
    console.error('Get flight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create flight (Admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const flight = new Flight(req.body);
    await flight.save();

    res.status(201).json({
      message: 'Flight created successfully',
      flight
    });
  } catch (error) {
    console.error('Create flight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update flight (Admin only)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const flight = await Flight.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json({
      message: 'Flight updated successfully',
      flight
    });
  } catch (error) {
    console.error('Update flight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete flight (Admin only)
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const flight = await Flight.findByIdAndDelete(req.params.id);
    if (!flight) {
      return res.status(404).json({ error: 'Flight not found' });
    }

    res.json({ message: 'Flight deleted successfully' });
  } catch (error) {
    console.error('Delete flight error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;