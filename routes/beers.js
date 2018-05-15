const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const Beer = require('./../models/beer');
const Comment = require('./../models/comment');

router.get('/', (req, res, next) => {
  Beer.find({})
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

router.get('/active', (req, res, next) => {
  Beer.find({active: true})
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
  Beer.findById(req.params.id)
    .populate({
      path: 'comments',
      model: 'Comment',
      populate: {
        path: 'owner',
        model: 'User'
      }})
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }
      res.json(result);
    })
    .catch(next);
});

router.post('/add', (req, res, next) => {
  for (let item in req.body) {
    if (!item) {
      return res.status(422).json({code: 'Unprocessable-entity'});
    }
  }

  const data = {
    name: req.body.name,
    type: req.body.type,
    abv: req.body.abv,
    ibu: req.body.ibu,
    brewery: req.body.brewery,
    color: req.body.color,
    active: req.body.active,
    pintPrice: req.body.pintPrice,
    halfPintPrice: req.body.halfPintPrice,
    comments: []
  };

  const beer = new Beer(data);

  beer.save()
    .then((result) => {
      res.json(result);
    })
    .catch(next);
});

router.post('/comments/add', (req, res, next) => {
  const date = new Date();
  const dateString = moment(date).format('MMMM Do YYYY, h:mm:ss a');

  const data = {
    content: req.body.text,
    date: dateString,
    owner: req.session.currentUser._id,
    beer: req.body.beerId
  };

  const comment = new Comment(data);
  comment.save()
    .then((comment) => {
      const options = {
        new: true
      };

      return Beer.findOneAndUpdate({_id: req.body.beerId}, {$addToSet: {comments: comment._id}}, options)
        .populate({
          path: 'comments',
          model: 'Comment',
          populate: {
            path: 'owner',
            model: 'User'
          }})
        .then(beer => {
          res.json(beer);
        });
    })
    .catch(next);
});

router.put('/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  }

  Beer.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }

      result.name = req.body.name;
      result.type = req.body.type;
      result.abv = req.body.abv;
      result.ibu = req.body.ibu;
      result.brewery = req.body.brewery;
      result.color = req.body.color;
      result.active = req.body.active;
      result.pintPrice = req.body.pintPrice;
      result.halfPintPrice = req.body.halfPintPrice;
      result.comments = req.body.comments;

      result.save()
        .then((result) => {
          res.json(result);
        })
        .catch(next);
    })
    .catch(next);
});

router.delete('/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  }

  Beer.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }

      result.remove()
        .then(() => {
          res.send();
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
