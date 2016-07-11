/* eslint-disable consistent-return, max-len, no-param-reassign, no-underscore-dangle */

import mongoose from 'mongoose';
// import Apartment from './apartment';
const Schema = mongoose.Schema;

const schema = new Schema({
  name: { type: String, required: true },
  money: { type: Number, required: true },
  dateCreated: { type: Date, default: Date.now },
  apartment: { type: mongoose.Schema.ObjectId, ref: 'Apartment', default: null },
});


// pay
// schema.statics.pay1 = function (id, cb) {
//   this.findById(id)
//   .populate('apartment')
//   .exec((err, renter) => {
//     if (renter.money < renter.apartment.rent) return cb();
//     renter.money -= renter.apartment.rent;
//     const updatedCollectedRent = renter.apartment.collectedRent + renter.apartment.rent;
//     renter.save(() => {
//       Apartment.findByIdAndUpdate({ _id: renter.apartment._id }, { collectedRent: updatedCollectedRent }, { new: true }, () => {
//         cb();
//       });
//     });
//   });
// };

schema.methods.pay = function (apartment, cb) {
  if (this.money < apartment.rent) return cb();
  this.money -= apartment.rent;
  apartment.collectedRent += apartment.rent;
  this.save(() => {
    apartment.save(() => {
      cb();
    });
  });
};

module.exports = mongoose.model('Renter', schema);
