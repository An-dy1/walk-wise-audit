import express from 'express';
const app = express();
const PORT = process.env.PORT || 3000;

import bodyParser from 'body-parser';
import { connectDB } from './database';
import passport from 'passport';
import passportConfig from './config/passport';
import userRoutes from './routes/users';

connectDB();

app.use(bodyParser.json());

app.use(passport.initialize());
passportConfig(passport);

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello and welcome to Walk Wise Audit!');
});

export default app;
