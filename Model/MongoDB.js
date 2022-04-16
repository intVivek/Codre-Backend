const { Schema, model } = require("mongoose");

const documentSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  userId: {
    type: String,
    required: true,
  },
  data: Object,
})

module.exports = model("Document", documentSchema)