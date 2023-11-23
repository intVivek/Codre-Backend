const mongoose = require("mongoose");

const connectMongoose = () => {
  mongoose
    .connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("DATABASE CONNECTED"))
    .catch((err) => console.error("Error connecting to mongo", err));
};

module.exports = connectMongoose;