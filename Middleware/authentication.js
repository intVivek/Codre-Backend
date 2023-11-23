const isAuthenticated = (req, res, next) => {
  if (!req.isAuthenticated())
    return res.json({ status: 0, message: "Unauthorized" });
  next();
};

const isNotAuthenticated = (req, res, next) => {
  if (req.isAuthenticated())
    return res.json({ status: 0, message: "Already authenticated" });
  next();
};

module.exports = {
  isAuthenticated,
  isNotAuthenticated,
};
