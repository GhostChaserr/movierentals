
module.exports = function (req, res, next) { 
  // 401 Unauthorized
  // 403 Forbidden 
  
  // Check if user is admin
  if (!req.user.isAdmin) return res.status(403).send('Access denied.');

  // Pass controll to next middleware
  next();
}