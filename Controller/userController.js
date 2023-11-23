const { getPopulatedUser } = require("../Services/userServices.js");
const { getPopularDocuments } = require("../Services/documentServices.js");

const handleHomeData = async (req, res) => {
    const userId = req.user._id;
  const data = await Promise.all([getPopulatedUser(userId), getPopularDocuments()]);
  res.json({ status: 1, home: data });
};

module.exports = { handleHomeData };
