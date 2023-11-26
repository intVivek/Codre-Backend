const { Schema, model } = require("mongoose");

const RoomSchema = new Schema(
  {
    _id: {
      type: String,
      required: true,
    },
    users: [
      {
        user: {
          type: String,
          ref: "User",
        },
        socketIds: [
          {
            type: String,
          },
        ],
      },
    ],
  },
  { timestamps: true, strictPopulate: false }
);

module.exports = model("Rooms", RoomSchema);
