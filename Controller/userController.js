const { getPopulatedUser } = require("../Services/userServices.js");
const { getPopularDocuments } = require("../Services/documentServices.js");

// Handles the request to retrieve home data for a user.
const handleHomeData = async (req, res) => {
  // Extracts the user ID from the authenticated user in the request.
  const userId = req.user._id;

  // Retrieves populated user data and popular documents concurrently.
  const data = await Promise.all([getPopulatedUser(userId), getPopularDocuments()]);

  // Sends the home data as a JSON response.
  res.json({ status: 1, home: data });
};

module.exports = { handleHomeData };
