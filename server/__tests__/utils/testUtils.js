const jwt = require('jsonwebtoken');
const secretKey = process.env.SECRET_OR_KEY;
// const { ObjectId } = require('mongodb');
const { ObjectId } = require('bson');

// todo: object id undefined, stopped here
// other todos:
// typescript
// commonjs > es6
exports.generateTestingToken = (id, email) => {
  const payload = {
    id: id,
    email: email,
  };

  return jwt.sign(payload, secretKey, { expiresIn: 3600 });
};
