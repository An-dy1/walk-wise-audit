const Entry = require('../models/Entry');
const Audit = require('../models/Audit');
const apiResponse = require('../utils/apiResponse');

exports.createAudit = async (req, res) => {
  const { entries, finalSummary } = req.body;
  const userId = req.user.id;

  if (!entries) {
    return apiResponse(
      res,
      'error',
      'At least one entry is required.',
      null,
      null,
      400
    );
  }

  try {
    const newAudit = new Audit({
      user: userId,
      entries: entries,
      finalSummary: finalSummary,
    });
    await newAudit.save();
    apiResponse(res, 'success', 'Audit created', newAudit, null, 201);
  } catch (err) {
    if (err.name === 'ValidationError') {
      console.log('here');
      return apiResponse(res, 'error', err.message, null, null, 400);
    }
    if (err.name === 'CastError') {
      return apiResponse(res, 'error', 'Invalid entry ID', null, null, 400);
    }
    if (err.name === 'MongoError') {
      return apiResponse(res, 'error', 'Duplicate entry ID', null, null, 400);
    }
    let message = err.message ? err.message : 'Server error';
    let status = err.status ? err.status : 500;
    apiResponse(res, 'error', message, null, null, status);
  }
};
