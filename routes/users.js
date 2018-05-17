const express = require('express');
const router = express.Router();
const User = require('../models/user');

// Get list of users
router.get('/', (req, res, next) => {
  if (req.session.currentUser.role !== 'admin') {
    return res.status(401).json({code: 'unauthorized'});
  }

  User.find({})
    .then(result => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }
      res.json(result);
    })
    .catch(next);
});

// Get one user
router.get('/:id', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }
  User.findById(req.params.id)
    .populate({
      path: 'favorites',
      model: 'Beer'
    })
    .then(result => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }
      res.json(result);
    })
    .catch(next);
});

// Add a beer to favorites
router.post('/me/favorites', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }
  const beerId = req.body.beer;
  const $updates = {
    $addToSet: {
      favorites: beerId
    }
  };
  const options = { 'new': true };
  User.findOneAndUpdate({_id: req.session.currentUser._id}, $updates, options)
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }
      req.session.currentUser = result;
      res.status(204).send();
    })
    .catch(next);
});

// @TODO Edit user
router.put('/me', (req, res, next) => {
  if (!req.session.currentUser) {
    return res.status(401).json({code: 'unauthorized'});
  }
  const $updates = {
    $set: {
      username: req.body.username
    }
  };
  const options = { 'new': true };
  User.findOneAndUpdate({_id: req.session.current._id}, $updates, options)
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }
      req.session.currentUser = result;
      res.json(result);
    })
    .catch(next);
});

// Remove a beer from user's favorites
router.delete('/me/favorites/:beerId', (req, res, next) => {
  const beerId = req.params.beerId;
  const $updates = {
    $pull: {
      favorites: beerId
    }
  };
  const options = { 'new': true };
  User.findOneAndUpdate({_id: req.session.currentUser._id}, $updates, options)
    .then((result) => {
      if (!result) {
        return res.status(404).json({code: 'not-found'});
      }
      req.session.currentUser = result;
      res.status(204).send();
    })
    .catch(next);
});

// Delete user
router.delete('/:id', (req, res, next) => {
  if (req.session.currentUser.role !== 'admin') {
    return res.status(401).json({code: 'unauthorized'});
  }

  User.findOneAndRemove({_id: req.params.id})
    .then(() => {
      res.status(204).send();
    })
    .catch(next);
});

module.exports = router;
