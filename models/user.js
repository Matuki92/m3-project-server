const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'admin']
  },
  favorites: {
    type: [{
      type: ObjectId,
      ref: 'Beer'
    }],
    default: []
  }
});

const User = mongoose.model('User', userSchema);

module.exports = User;
