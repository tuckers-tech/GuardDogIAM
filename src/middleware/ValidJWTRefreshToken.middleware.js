/**
 * This file is a middleware function for checking the JWT middleware
 */
const jwt = require('jsonwebtoken');

function ValidJWTRefreshToken(req, res, next) {
  console.log(req.body.refreshToken);
  jwt.verify(
    req.body.refreshToken,
    process.env.JWT_REFRESH_SECRET,
    (err, payload) => {
      if (err !== null) {
        res.json({ status: 401, message: 'No Token' });
      } else {
        req.refreshTokenValue = payload;
        next();
      }
    }
  );
}

module.exports = ValidJWTRefreshToken;
