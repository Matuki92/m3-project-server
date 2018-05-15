const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new Schema({
  content: String,
  date: String,
  owner: {
    type: ObjectId,
    ref: 'users'
  },
  beer: {
    type: ObjectId,
    ref: 'beers'
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
