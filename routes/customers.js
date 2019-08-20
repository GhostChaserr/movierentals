const {Customer, validate} = require('../models/customer'); 
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();


// Route for listing customer
router.get('/', async (req, res) => {

  // Fetch customers and sort them by name
  const customers = await Customer.find().sort('name');

  // Send sorted array back to client
  res.send(customers);
});


// Register new customer
router.post('/', async (req, res) => {

  // Validate received data
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Register new customer instnace
  let customer = new Customer({ 
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone
  });

  // Save customer back to database
  customer = await customer.save();
  
  // Send client registered customer
  res.send(customer);
});


// Update customer details
router.put('/:id', async (req, res) => {

  // Data validation
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  // Update customer credentials
  const customer = await Customer.findByIdAndUpdate(req.params.id,
    { 
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone
    }, { new: true });

  // Make sure customer with given ID Exists
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');
  
  // Send updated customer data back
  res.send(customer);

});

router.delete('/:id', async (req, res) => {

  // Find and remove customer
  const customer = await Customer.findByIdAndRemove(req.params.id);

  // If customer cant be found response not found status code
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  // Send deleted customer data
  res.send(customer);

});

// Get customer with given id
router.get('/:id', async (req, res) => {

  // Make sure customer exissts
  const customer = await Customer.findById(req.params.id);

  // If not found send 404
  if (!customer) return res.status(404).send('The customer with the given ID was not found.');

  // Send customer to client
  res.send(customer);
  
});

module.exports = router; 