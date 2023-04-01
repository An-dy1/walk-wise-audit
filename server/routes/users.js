const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { check, validationResult } = require('express-validator');
const apiResponse = require('../utils/apiResponse');
const User = require('../models/User');
const secretKey = process.env.SECRET_OR_KEY;

const userController = require('../controllers/userController');

// @route   POST /api/users/register
// @desc    Register a user
// @access  Public
router.post(
  '/register',
  [
    check('email', 'A valid email is required').isEmail(),
    check('password', 'Password must be at least 6 characters').isLength({
      min: 6,
    }),
  ],

  userController.register // This function will automatically receive (req, res) from Express
);

// @route   POST /api/users/login
// @desc    Login a user and return JWT token
// @access  Public
router.post(
  '/login',
  [
    check('email', 'A valid email is required').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  userController.login
);

module.exports = router;
