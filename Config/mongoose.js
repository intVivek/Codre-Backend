const mongoose = require("mongoose");

/**
 * Connects to the MongoDB database using Mongoose.
 */
const connectMongoose = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,           // Use new URL parser
      useUnifiedTopology: true,        // Use new server discovery and monitoring engine
    })
    .then(() => console.log("DATABASE CONNECTED")) // Connection successful
    .catch((err) => console.error("Error connecting to MongoDB", err)); // Connection error
};

module.exports = connectMongoose;