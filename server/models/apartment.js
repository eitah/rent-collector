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

module.exports = mongoose.model('Apartment', schema);
