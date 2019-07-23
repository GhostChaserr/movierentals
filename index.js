

// Load core libs
const dotenv  = require('dotenv');
const mongoose = require('mongoose');
const express = require('express');


// Enable reading env variables
dotenv.config();

// Try to connect mongodb
mongoose.connect(process.env.DB_URL, { useNewUrlParser : true })
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...'));



// Instantiate new express server
const app = express();

// Load routes
const genres = require('./routes/genres');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');






// Setting up Middlewares
app.use(express.json());


// Registering App routes
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);


// Initialize port
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));