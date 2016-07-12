/* eslint-disable newline-per-chained-call, new-cap, no-param-reassign, consistent-return, no-underscore-dangle, no-console, array-callback-return, max-len */

import express from 'express';
import Renter from '../models/renter';
import Apartment from '../models/apartment';
import bodyValidator from '../validators/renters/body';
import queryValidator from '../validators/renters/query';
import paramsValidator from '../validators/renters/params';
const router = module.exports = express.Router();

// index
router.get('/', queryValidator, (req, res) => {
  Renter.find(res.locals.filter)
          .sort(res.locals.sort)
          .limit(res.locals.limit)
          .skip(res.locals.skip)
          .exec((err, renters) => {
            res.send({ renters });
          });
});

// show
router.get('/:id', paramsValidator, (req, res) => {
  Renter.findById(req.params.id, (err, renter) => {
    if (renter) {
      res.send({ renter });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

// update
router.put('/:id', paramsValidator, bodyValidator, (req, res) => {
  Renter.findByIdAndUpdate(req.params.id, res.locals, { new: true }, (err, renter) => {
    res.send({ renter });
  });
});

// create
router.post('/', bodyValidator, (req, res) => {
  Renter.create(res.locals, (err, renter) => {
    res.send({ renter });
  });
});

// delete
router.delete('/:id', paramsValidator, (req, res) => {
  Renter.findByIdAndRemove(req.params.id, (err, renter) => {
    if (renter) {
      res.send({ id: renter._id });
    } else {
      res.status(400).send({ messages: ['id not found'] });
    }
  });
});

// router.put('/:id/pay1', paramsValidator, bodyValidator, (req, res) => {
//   Renter.pay(req.params.id, () => {
//     Renter.findById(req.params.id)
//     .populate('apartment')
//     .exec((err, renter) => {
//       res.send({ renter });
//     });
//   });
// });

// pay
router.put('/:id/pay', paramsValidator, bodyValidator, (req, res) => {
  Renter.findById(req.params.id, (err, renter) => {
    Apartment.findById(renter.apartment, (err2, apartment) => {
      renter.pay(apartment, () => {
        res.send({ renter, apartment });
      });
    });
  });
});
