/* eslint-disable func-names, prefer-arrow-callback, no-underscore-dangle */

import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  sqft: { type: Number, required: true },
  bedrooms: { type: Number, required: true },
  floor: { type: Number, required: true },
  rent: { type: Number, required: true },
  dateCreated: { type: Date, default: Date.now },
  renter: { type: mongoose.Schema.ObjectId, ref: 'Renter', default: null },
  collectedRent: { type: Number, default: 0 },
});


schema.methods.lease = function (renterId, cb) {
  this.renter = renterId;
  this.save(function (err, apartment) {
    console.log('err in save', err, renterId);
    const query = { _id: renterId };
    const update = { apartment: apartment._id };
    const options = { new: true };
    Renter.findOneAndUpdate(query, update, options, function(err2, renter) {
      console.log('apartment', apartment, 'renter', renter);
      cb(null, { apartment });
    })
  })
}





















module.exports = mongoose.model('Apartment', schema);
