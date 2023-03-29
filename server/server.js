const app = require('./app');
const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`Walk Wise Audit server is running on port ${port}`);
});

module.exports = server;
