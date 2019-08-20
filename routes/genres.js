const validateObjectId = require('../middleware/validateObjectId');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const {Genre, validate} = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// Lis all genras
router.get('/', async (req, res) => {

  // Fetch genres from DB
  const genres = await Genre.find().sort('name');

  // Send list to client
  res.send(genres);
});


// Register new genre
router.post('/', auth, async (req, res) => {

  // Data validation
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Register new genre - cretes genre instant
  let genre = new Genre({ name: req.body.name });

  // Save gere instant
  genre = await genre.save();
  
  // Send to client
  res.send(genre);

});


// Update genere
router.put('/:id', [auth, validateObjectId], async (req, res) => {

  // Data validaion
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  // Update genre details
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  // If genre cant be found respond with 404
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
  // Send genre back
  res.send(genre);

});


// Delete genere with ID
router.delete('/:id', [auth, admin, validateObjectId], async (req, res) => {
  
  // Remove genere ID
  const genre = await Genre.findByIdAndRemove(req.params.id);

  // IF Cant be found send NOT FOUND
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Send found genre to client
  res.send(genre);

});

router.get('/:id', validateObjectId, async (req, res) => {

  // Find genre with given iD
  const genre = await Genre.findById(req.params.id);

  // If not found send 404
  if (!genre) return res.status(404).send('The genre with the given ID was not found.');

  // Send genere to client
  res.send(genre);
});

module.exports = router;