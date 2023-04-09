const Entry = require('../models/Entry');
const Audit = require('../models/Audit');
const apiResponse = require('../utils/apiResponse');

exports.createAudit = async (req, res) => {
  const { entries, finalSummary } = req.body;
  const userId = req.user.id;

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
      return apiResponse(
        res,
        'error',
        'Invalid entry ID',
        null,
        err.message,
        400
      );
    }
    if (err.name === 'CastError') {
      console.log('cast error');
      return apiResponse(
        res,
        'error',
        'Invalid entry ID',
        null,
        err.message,
        400
      );
    }

    let message = err.message ? err.message : 'Server error';
    let status = err.status ? err.status : 500;
    apiResponse(res, 'error', message, null, null, status);
  }
};
