const router = require('express').Router();
const passport = require('passport');
const {
  createEntry,
  getEntries,
  getEntry,
  updateEntry,
  deleteEntry,
} = require('../controllers/entryController');

// @route  POST /api/entries/create
// @desc   Create a new entry
// @access Private
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  createEntry
);

// @route  GET /api/entries
// @desc   Get all entries for the authenticated user
// @access Private
router.get('/', passport.authenticate('jwt', { session: false }), getEntries);

// @route  GET /api/entries/:id
// @desc   Get a single entry by ID
// @access Private
router.get('/:id', passport.authenticate('jwt', { session: false }), getEntry);

// // @route  PUT /api/entries/:id
// // @desc   Update an entry by ID
// // @access Private
router.put(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  updateEntry
);

// // @route  DELETE /api/entries/:id
// // @desc   Delete an entry by ID
// // @access Private
router.delete(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  deleteEntry
);

module.exports = router;
