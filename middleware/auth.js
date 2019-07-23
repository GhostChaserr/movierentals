
// Load jwt module
const jwt = require('jsonwebtoken');


module.exports = function (req, res, next) {

  // Extract token from header
  const token = req.header('x-auth-token');

  // Make sure tokene xists
  if (!token) return res.status(401).send('Access denied. No token provided.');

  try {

    // Try to decode token
    const decoded = jwt.verify(token, process.env.USER_SECRET);
    
    // Pass daa to request object
    req.user = decoded; 

    // Pass control to next middleware
    next();
  }
  catch (ex) {

    // Return error message - token is invalid
    res.status(400).send('Invalid token.');
  }
}