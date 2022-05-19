const { Schema, model } = require("mongoose");

const documentSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  user: {
    type: String,
    ref: "User"
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
},{ timestamps: true });

module.exports = model("Document", documentSchema);
