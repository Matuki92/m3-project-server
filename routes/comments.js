const express = require('express');
const router = express.Router();
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

// router.put('/:id', (req, res, next) => {
//   Comment.findById(req.body.comment._id)
//     .then((result) => {
//       res.json(result);
//     })
//     .catch(next);
// });

module.exports = router;
