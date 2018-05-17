const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const moment = require('moment');

const Beer = require('./../models/beer');
const Comment = require('./../models/comment');

const options = {
  new: true
};

// Get all the beers
router.get('/', (req, res, next) => {
  // req session?
  Beer.find({})
    .then(result => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }
      res.json(result);
    })
    .catch(next);
});

// Get beers with active: true status only
router.get('/active', (req, res, next) => {
  Beer.find({active: true})
    .then(result => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }
      res.json(result);
    })
    .catch(next);
});

// Get one beer
router.get('/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  } else if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }

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

// Add a new beer
router.post('/add', (req, res, next) => {
  if (req.session.currentUser.role !== 'admin') {
    return res.status(401).json({code: 'unauthorized'});
  }
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

// Add a new comment to an existing beer
router.post('/comments/add', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }
  for (let item in req.body) {
    if (!item) {
      return res.status(422).json({code: 'Unprocessable-entity'});
    }
  }

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
      return Beer.findOneAndUpdate({_id: req.body.beerId}, {$addToSet: {comments: comment._id}}, options)
        .populate({
          path: 'comments',
          model: 'Comment',
          populate: {
            path: 'owner',
            model: 'User'
          }})
        .then(beer => {
          if (!beer) {
            return res.status(404).json({code: 'not-found'});
          }
          res.json(beer);
        });
    })
    .catch(next);
});

// Edit an existing beer
router.put('/edit', (req, res, next) => {
  if (req.session.currentUser.role !== 'admin') {
    return res.status(401).json({code: 'unauthorized'});
  }
  for (let item in req.body) {
    if (!item) {
      return res.status(422).json({code: 'Unprocessable-entity'});
    }
  }

  const $updates = {
    name: req.body.name,
    type: req.body.type,
    abv: req.body.abv,
    ibu: req.body.ibu,
    brewery: req.body.brewery,
    color: req.body.color,
    active: req.body.active,
    pintPrice: req.body.pintPrice,
    halfPintPrice: req.body.halfPintPrice
  };

  Beer.findByIdAndUpdate({_id: req.body._id}, $updates, options)
    .then(beer => {
      if (!beer) {
        return res.status(404).json({code: 'not-found'});
      }
      res.json(beer);
    })
    .catch(next);
});

// Delete a beer
router.delete('/:id', (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return next();
  } else if (req.session.currentUser.role !== 'admin') {
    return res.status(401).json({code: 'unauthorized'});
  }

  Beer.findById(req.params.id)
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }

      result.remove()
        .then(() => {
          res.status(204).send();
        })
        .catch(next);
    })
    .catch(next);
});

module.exports = router;
