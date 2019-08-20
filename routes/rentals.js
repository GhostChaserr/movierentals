const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 
const mongoose = require('mongoose');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();


// Initializing fawn to perform TWO PHASE COMMITS
Fawn.init(mongoose);


// Fetch rentals.
router.get('/', async (req, res) => {

  // sort by dateout
  const rentals = await Rental.find().sort('-dateOut');

  // Send renals back to client
  res.send(rentals);
});

// Add new rental
router.post('/', async (req, res) => {

  // Validate data
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Make sure customer exists
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  // Make sure movie exists
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  // Check if movie is available
  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.');

  // Generate new rental instance
  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  });

  // Runs transaction
  // 1. saves new rental to rentals collection
  // 2. updates movie being rented
  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { 
        $inc: { numberInStock: -1 }
      })
      .run();
      
    // Initialize transaction
    res.send(rental);
  }
  catch(ex) {

    // Transaction failed
    res.status(500).send('Something failed.');
  }
});


// Get rental by id
router.get('/:id', async (req, res) => {

  // Fetch rental
  const rental = await Rental.findById(req.params.id);

  // Make sure rental exists
  if (!rental) return res.status(404).send('The rental with the given ID was not found.');

  // Send rental bakc to client
  res.send(rental);
  
});

module.exports = router; 