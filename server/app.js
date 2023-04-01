const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const bodyParser = require('body-parser');
const { connectDB } = require('./database');
const passport = require('passport');
const passportConfig = require('./config/passport');
const userRoutes = require('./routes/users');
const entryRoutes = require('./routes/entries');

connectDB();

app.use(bodyParser.json());

app.use(passport.initialize());
passportConfig(passport);

app.use('/api/users', userRoutes);
app.use('/api/entries', entryRoutes);

app.get('/', (req, res) => {
  res.send('Hello and welcome to Walk Wise Audit!');
});

module.exports = app;
