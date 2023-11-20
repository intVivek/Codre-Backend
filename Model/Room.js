const { Schema, model } = require("mongoose");

const RoomSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    users: [
      {
        type: String,
        ref: "User",
      },
    ],
  },
  { timestamps: true, strictPopulate: false }
);

module.exports = model("Rooms", RoomSchema);
