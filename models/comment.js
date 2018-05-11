const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const commentSchema = new Schema({
  content: String,
  date: Date,
  owner: {
    type: ObjectId,
    ref: 'users'
  }
});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
