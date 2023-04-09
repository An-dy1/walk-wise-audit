import express, { Request, Response } from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

import bodyParser from 'body-parser';
import passport from 'passport';
// const bodyParser = require('body-parser');
// const passport = require('passport');
const { connectDB } = require('./database');
const passportConfig = require('./config/passport');
const userRoutes = require('./routes/users');
const entryRoutes = require('./routes/entries');

connectDB();

app.use(bodyParser.json());

app.use(passport.initialize());
passportConfig(passport);

app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);

export default app;
