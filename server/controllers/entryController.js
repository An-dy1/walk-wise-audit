const Entry = require('../models/Entry');
const apiResponse = require('../utils/apiResponse');

exports.createEntry = async (req, res) => {
  const {
    location,
    coordinates,
    text,
    pictures,
    treeCoverRating,
    adaComplianceRating,
    noiseRating,
    litterRating,
  } = req.body;
  const userId = req.user.id;

  try {
    const newEntry = new Entry({
      user: userId,
      location,
      coordinates,
      text,
      pictures,
      ratings: {
        treeCover: treeCoverRating,
        adaCompliance: adaComplianceRating,
        noise: noiseRating,
        litter: litterRating,
      },
    });
    await newEntry.save();
    apiResponse(res, 'success', 'Entry created', newEntry, 201);
  } catch (err) {
    if (!location || !coordinates) {
      return apiResponse(
        res,
        'error',
        'Location and coordinates are required.',
        null,
        null
      );
    }

    if (err.name === 'ValidationError') {
      console.log('here');
      return apiResponse(res, 'error', err.message, null, null);
    }

    let message = err.message ? err.message : 'Server error';
    let status = err.status ? err.status : 500;
    apiResponse(res, 'error', message, null, status);
  }
};

exports.getEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await Entry.find({ user: userId });
    apiResponse(res, 'success', 'Entries retrieved', entries, null);
  } catch (err) {
    console.error(err.message);
    apiResponse(res, 'error', 'Server error', null, 500);
  }
};
