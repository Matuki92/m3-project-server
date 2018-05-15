const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res, next) => {
  User.find({})
    .then(result => {
      res.json(result);
    })
    .catch(next);
});

router.get('/:id', (req, res, next) => {
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

router.put('/me', (req, res, next) => {
  const $updates = {
    $set: {
      username: req.body.username
    }
  };
  const options = { 'new': true };
  User.findOneAndUpdate({_id: req.session.current._id}, $updates, options)
    .then((result) => {
      req.session.currentUser = result;
      res.json(result);
    })
    .catch(next);
});

router.post('/me/favorites', (req, res, next) => {
  const beerId = req.body.beer;
  const $updates = {
    $addToSet: {
      favorites: beerId
    }
  };
  const options = { 'new': true };
  User.findOneAndUpdate({_id: req.session.currentUser._id}, $updates, options)
    .then((result) => {
      req.session.currentUser = result;
      res.status(204).send();
    })
    .catch(next);
});

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
      req.session.currentUser = result;
      res.status(204).send();
    })
    .catch(next);
});

module.exports = router;
