const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = Schema.Types.ObjectId;

const beerSchema = new Schema({
  name: String,
  type: String,
  abv: Number,
  ibu: Number,
  brewery: String,
  color: String,
  active: Boolean,
  pintPrice: Number,
  halfPintPrice: Number,
  comments: {
    type: [ObjectId],
    ref: 'comments'
  }
});

const Beer = mongoose.model('Beer', beerSchema);

module.exports = Beer;
