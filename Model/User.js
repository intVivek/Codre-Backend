const { Schema, model } = require("mongoose");

const userSchema = new Schema({
  _id: {
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
    created: [{
      type: String,
      ref: "Document"
    }],   
    recentlyJoined: [{
      type: String,
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
},{ timestamps: true });

module.exports = model('User', userSchema)