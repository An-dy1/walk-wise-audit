const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_OR_KEY;
const { ObjectId } = require('bson');

// todo: object id undefined, stopped here
exports.generateTestingToken = (email) => {
  let id = new ObjectId();
  const payload = {
    id: id,
    email: email,
  };

  return jwt.sign(payload, secretKey, { expiresIn: 3600 });
};
