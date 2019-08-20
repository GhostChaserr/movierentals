const Joi = require('joi');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// Auth endpoint - Separate as service
router.post('/', async (req, res) => {

  // Data validation
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Validate user via email - make sure email exists
  let user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send('Invalid email or password.');

  // Validate password
  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) return res.status(400).send('Invalid email or password.');

  // Generate Token
  const token = user.generateAuthToken();

  // Send token back to client
  res.send(token);
});

function validate(req) {

  // Validate objects on request body
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  };

  // Return validation result
  return Joi.validate(req, schema);
}

module.exports = router; 
