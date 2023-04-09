const router = require('express').Router();
const passport = require('passport');
const { createAudit } = require('../controllers/auditController');

// @route  POST /api/audits/create
// @desc   Create a new audit
// @access Private
router.post(
  '/create',
  passport.authenticate('jwt', { session: false }),
  createAudit
);

// @route  GET /api/entries
// @desc   Get all entries for the authenticated user
// @access Private
// router.get('/', passport.authenticate('jwt', { session: false }), getEntries);

module.exports = router;
