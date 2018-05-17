const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('./../models/comment');

// Get comment by owner
router.get('/user/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  } else if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }

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
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }
      res.json(result);
    })
    .catch(next);
});

// Delete comment
router.delete('/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  } else if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }

  Comment.findById(req.params.id)
    .populate({
      path: 'owner',
      model: 'User'
    })
    .then(comment => {
      if ('' + comment.owner._id !== req.session.currentUser._id) {
        return res.status(401).json({code: 'unauthorized'});
      }
      return comment.remove()
        .then((result) => {
          if (!result) {
            return res.status(404).json({code: 'not-found'});
          }
          res.status(204).send();
        });
    })
    .catch(next);
});

module.exports = router;
