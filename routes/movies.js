const {Movie, validate} = require('../models/movie'); 
const {Genre} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// List all movies
router.get('/', async (req, res) => {

  // Fetch movies from database
  const movies = await Movie.find().sort('name');

  // Send movies as response
  res.send(movies);

});

router.post('/', async (req, res) => {

  // Data validaiton
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Find genere fot the movie being rented
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  // Create new movie instant
  const movie = new Movie({ 
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  });

  // Save movie back to database
  await movie.save();
  
  // Send movie to client
  res.send(movie);
});


// Route UPDATES Movie record
router.put('/:id', async (req, res) => {

  // Dara validation
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Make sure genere exists
  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Invalid genre.');

  // Fetch movie record and update it
  const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate
    }, { new: true });
  
  // Respond with 404 if nout found
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');
  
  // Send movie back
  res.send(movie);


});


// Delete movie
router.delete('/:id', async (req, res) => {

  // Fetch movie to be removed
  const movie = await Movie.findByIdAndRemove(req.params.id);

  // If not found send 404
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  // Send fetched movie back
  res.send(movie);
});


// Get particular movie resource
router.get('/:id', async (req, res) => {

  // Fetch movie wiith given id
  const movie = await Movie.findById(req.params.id);

  // If nout found respond with 404
  if (!movie) return res.status(404).send('The movie with the given ID was not found.');

  // Send movie record back to client
  res.send(movie);
});

module.exports = router; 