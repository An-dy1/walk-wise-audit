const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_OR_KEY;

exports.generateTestingToken = (id, email) => {
  const payload = {
    id: id,
    email: email,
  };

  return jwt.sign(payload, secretKey, { expiresIn: 3600 });
};
