// Middleware to check if a user is authenticated.
const isAuthenticated = (req, res, next) => {
  // If the user is not authenticated, send an unauthorized JSON response.
  if (!req.isAuthenticated())
    return res.json({ status: 0, message: "Unauthorized" });

  // Continue to the next middleware or route handler.
  next();
};

// Middleware to check if a user is not authenticated.
const isNotAuthenticated = (req, res, next) => {
  // If the user is already authenticated, send a JSON response indicating that.
  if (req.isAuthenticated())
    return res.json({ status: 0, message: "Already authenticated" });

  // Continue to the next middleware or route handler.
  next();
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
};