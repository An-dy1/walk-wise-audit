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
        null,
        400
      );
    }

    if (err.name === 'ValidationError') {
      console.log('here');
      return apiResponse(res, 'error', err.message, null, null);
    }

    let message = err.message ? err.message : 'Server error';
    let status = err.status ? err.status : 500;
    apiResponse(res, 'error', message, null, null, status);
  }
};

exports.getEntries = async (req, res) => {
  try {
    const userId = req.user.id;
    const entries = await Entry.find({ user: userId });
    apiResponse(res, 'success', 'Entries retrieved', entries, null);
  } catch (err) {
    console.error(err.message);
    apiResponse(res, 'error', 'Server error', null, null, 500);
  }
};

exports.getEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
    apiResponse(res, 'success', 'Entry retrieved', entry, null, 200);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return apiResponse(res, 'error', 'Entry not found', null, null, 404);
    }
    if (err.name === 'CastError') {
      return apiResponse(res, 'error', 'Entry not found', null, null, 404);
    }
    if (err.name === 'ValidationError') {
      return apiResponse(res, 'error', err.message, null, null, 400);
    }
    console.error(err.message);
    apiResponse(res, 'error', 'Server error', null, null, 500);
  }
};

exports.updateEntry = async (req, res) => {
  try {
    const entry = await Entry.findById(req.params.id);
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

    if (location) entry.location = location;
    if (coordinates) entry.coordinates = coordinates;
    if (text) entry.text = text;
    if (pictures) entry.pictures = pictures;
    if (treeCoverRating) entry.ratings.treeCover = treeCoverRating;
    if (adaComplianceRating) entry.ratings.adaCompliance = adaComplianceRating;
    if (noiseRating) entry.ratings.noise = noiseRating;
    if (litterRating) entry.ratings.litter = litterRating;

    await entry.save();
    apiResponse(res, 'success', 'Entry updated', entry, null, 200);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return apiResponse(res, 'error', 'Entry not found', null, null, 404);
    }
    if (err.name === 'CastError') {
      return apiResponse(res, 'error', 'Entry not found', null, null, 404);
    }
    if (err.name === 'ValidationError') {
      return apiResponse(res, 'error', err.message, null, null, 400);
    }
    console.error(err.message);
    apiResponse(res, 'error', 'Server error', null, 500);
  }
};

exports.deleteEntry = async (req, res) => {
  try {
    // const entry = await Entry.findById(req.params.id);
    // await entry.remove();
    await Entry.deleteOne({ _id: req.params.id });
    apiResponse(res, 'success', 'Entry deleted', null, null, 200);
  } catch (err) {
    if (err.kind === 'ObjectId') {
      return apiResponse(res, 'error', 'Entry not found', null, null, 404);
    }
    if (err.name === 'CastError') {
      return apiResponse(res, 'error', 'Entry not found', null, null, 404);
    }
    if (err.name === 'ValidationError') {
      return apiResponse(res, 'error', err.message, null, null, 400);
    }
    console.error(err.message);
    apiResponse(res, 'error', 'Server error', null, null, 500);
  }
};
