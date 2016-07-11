/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, no-console, array-callback-return, max-len */

import express from 'express';
import Apartment from '../models/apartment';
import bodyValidator from '../validators/apartments/body';
import queryValidator from '../validators/apartments/query';
import paramsValidator from '../validators/apartments/params';
const router = module.exports = express.Router();

// index
router.get('/', queryValidator, (req, res) => {
  Apartment.find(res.locals.filter)
          .sort(res.locals.sort)
          .limit(res.locals.limit)
          .skip(res.locals.skip)
          .exec((err, apartments) => {
            res.send({ apartments });
          });
});

// show
router.get('/:id', paramsValidator, (req, res) => {
  Apartment.findById(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ apartment });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

// update
router.put('/:id', paramsValidator, bodyValidator, (req, res) => {
  Apartment.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, apartment) => {
    res.send({ apartment });
  });
});

// create
router.post('/', bodyValidator, (req, res) => {
  Apartment.create(res.locals, (err, apartment) => {
    res.send({ apartment });
  });
});

// delete d
router.delete('/:id', paramsValidator, (req, res) => {
  Apartment.findByIdAndRemove(req.params.id, (err, apartment) => {
    if (apartment) {
      res.send({ id: apartment._id });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});
