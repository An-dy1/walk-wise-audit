const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

const connectDB = require('./database');
const passport = require('passport');
const passportConfig = require('./config/passport');
const userRoutes = require('./routes/users');

connectDB();

app.use(passport.initialize());
passportConfig(passport);

app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
  res.send('Hello, Walk Wise Audit!');
});

app.listen(PORT, () => {
  console.log(`Walk Wise Audit server is running on port ${PORT}`);
});
