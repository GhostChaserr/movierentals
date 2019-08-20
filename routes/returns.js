const Joi = require('joi');
const validate = require('../middleware/validate');
const {Rental} = require('../models/rental');
const {Movie} = require('../models/movie');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();


// Route to return rented movie
router.post('/', [auth, validate(validateReturn)], async (req, res) => {

  // Look for rental with cusomer id and movie id
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  // Make sure rental exists
  if (!rental) return res.status(404).send('Rental not found.');

  // If already returned 
  if (rental.dateReturned) return res.status(400).send('Return already processed.');

  
  rental.return();
  await rental.save();

  // Find rented movie and update stock value
  await Movie.update({ _id: rental.movie._id }, {
    $inc: { numberInStock: 1 }
  });


  // Return rented rental
  return res.send(rental);
});

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  };

  return Joi.validate(req, schema);
}

module.exports = router;
