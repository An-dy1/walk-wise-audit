const Entry = require('../models/Entry');
const apiResponse = require('../utils/apiResponse');

exports.createEntry = async (req, res) => {
  const {
    location,
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
    apiResponse(res, 'success', 'Entry created', newEntry, null);
  } catch (err) {
    console.error(err.message);
    apiResponse(res, 'error', 'Server error', null, 500);
  }
};

// exports.getEntries = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const entries = await Entry.find({ user: userId });
//     apiResponse(res, 'success', 'Entries retrieved', entries, null);
//   } catch (err) {
//     console.error(err.message);
//     apiResponse(res, 'error', 'Server error', null, 500);
//   }
// };
