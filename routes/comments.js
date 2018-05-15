const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('./../models/comment');

router.get('/user/:id', (req, res, next) => {
  Comment.find({owner: req.params.id})
    .populate({
      path: 'owner',
      model: 'User'
    })
    .populate({
      path: 'beer',
      model: 'Beer'
    })
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  }
  Comment.findById(req.params.id)
    .remove()
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }
      res.send();
    })
    .catch(next);
});

module.exports = router;
