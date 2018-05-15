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

router.put('/:id', (req, res, next) => {
  User.findById(req.params.id)
    .then(result => {
      const favorites = req.body.favorites;

      if (favorites) {
        //check if alrweeady in the favorites
        result.favorites = favorites;
      }

      result.save()
        .then(() => {
          req.session.currentUser = result;
          res.json(result);
        });
    })
    .catch(next);
});

module.exports = router;
