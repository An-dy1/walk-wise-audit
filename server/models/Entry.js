const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EntrySchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  audit: {
    type: Schema.Types.ObjectId,
    ref: 'Audit',
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
  text: {
    type: String,
    required: false,
  },
  pictures: [
    {
      type: String,
      required: false,
    },
  ],
  ratings: {
    treeCover: { type: Number, min: 0, max: 5, required: false },
    adaCompliance: { type: Number, min: 0, max: 5, required: false },
    noise: { type: Number, min: 0, max: 5, required: false },
    litter: { type: Number, min: 0, max: 5, required: false },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = Entry = mongoose.model('Entry', EntrySchema);
