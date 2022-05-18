const { Schema, model } = require("mongoose");

const documentSchema = new Schema({
  _id: {
    type: String,
    required: true,
  },
  User: {
    type: Schema.Types.ObjectId,
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
})

const userSchema = new Schema({
  googleId: {
        type: String,
        required: true,
    },
    color: {
      type: String,
      required: true,
    },
    name: {
      type: Object,
      required: true,
    },
    emails: {
      type: Array,
      required: true,
    },    
    recentlyJoined: {
      type: Array,
      required: false,
    },    
    created: [{
      type: Schema.Types.ObjectId,
      ref: "Document"
    }],
    photos: {
      type: Array,
      required: true,
    },
    provider: {
      type: String,
      required: true,
  }
})

const Document = model('User', userSchema);

module.exports = Document;

module.exports = model("Document", documentSchema);