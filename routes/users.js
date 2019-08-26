
// Core libs
const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const {User, validate} = require('../models/user');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// Fetch current user - except password
router.get('/me', auth, async (req, res) => {

  // Find user By Given ID.
  const user = await User.findById(req.user._id).select('-password');

  // Send user back to user.
  res.send(user);
});


// Register new user
router.post('/', async (req, res) => {

  // Validate request data.
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Make sure user is not already registered
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registered.');

  // Pick suer data and return saved user back
  user = new User(_.pick(req.body, ['name', 'email', 'password']));

  // Hash user password
  const salt = await bcrypt.genSalt(10);
  user.password = await bcrypt.hash(user.password, salt);
  
  // Save user back to database
  await user.save();

  // Generate user auth token
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
  
});

module.exports = router; 
