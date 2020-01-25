/**
 * This file is a middleware function for checking the JWT middleware
 */
const jwt = require('jsonwebtoken');

function ValidJWTAccessToken(req, res, next) {
  jwt.verify(req.token, process.env.JWT_ACCESS_SECRET, (err, payload) => {
    if (err) {
      res.status(401).send('Token Invalid');
    } else {
      req.accessTokenValue = payload;
      next();
    }
  });
}

module.exports = ValidJWTAccessToken;
