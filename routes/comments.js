const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Comment = require('./../models/comment');

router.post('/add', (req, res, next) => {
  const data = {
    content: req.body.comment,
    date: new Date(),
    owner: req.session.currentUser._id
  };

  const comment = new Comment(data);

  comment.save()
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
