const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
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
      type: mongoose.Schema.Types.ObjectId,
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

module.exports = mongoose.model('User', userSchema)