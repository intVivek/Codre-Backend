const { Schema, model } = require("mongoose");

const documentSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  user: {
    type: Object,
    required: true,
  },
  roomName: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: false,
  },
  invite: {
    type: Boolean,
    required: true,
  },
  data: Object,
})

module.exports = model("Document", documentSchema)