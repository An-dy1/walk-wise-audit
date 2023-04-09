const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const AuditSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  entries: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Entry',
      required: true,
    },
  ],
  finalSummary: {
    type: String,
    required: false, // Set to true if a final summary is mandatory
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

module.exports = Audit = mongoose.model('Audit', AuditSchema);
