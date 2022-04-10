const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
  googleId: {
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