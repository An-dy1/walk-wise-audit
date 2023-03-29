import express from 'express';
const router = express.Router();
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { check, validationResult } from 'express-validator';
import apiResponse from '../utils/apiResponse';
import User from '../models/User';
const secretKey = process.env.SECRET_OR_KEY;

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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return apiResponse(
        res,
        'error',
        'Validation error',
        null,
        errors.array()
      );
    }

    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });
      if (user) {
        return apiResponse(res, 'error', 'User already exists', null, null);
      }

      user = new User({ email, password });

      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      await user.save();

      const payload = {
        id: user.id,
        email: user.email,
      };

      jwt.sign(payload, secretKey, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        apiResponse(res, 'success', 'User registered', { token }, null);
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
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
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid email or password' }] });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ errors: [{ msg: 'Invalid email or password' }] });
      }

      const payload = {
        id: user.id,
        email: user.email,
      };

      jwt.sign(payload, secretKey, { expiresIn: 3600 }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server error');
    }
  }
);

export default router;
