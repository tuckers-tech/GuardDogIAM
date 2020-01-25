const express = require('express');

const router = express.Router();

const getUserByEmail = require('../../utils/helpers/get-user');
const createAccessJWT = require('../../utils/helpers/create-access-jwt');
const createRefreshJWT = require('../../utils/helpers/create-refresh-jwt');

const bcrypt = require('bcrypt');

router.post('/', (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.json({ status: 401, message: 'Missing Data' });
  }

  // Get the email, username, and password
  const email = req.body.email;
  const password = req.body.password;

  // Get the user with that username
  getUserByEmail(email)
    .then(user => {
      if (user !== null) {
        const passwordHash = user.passwordHash;

        bcrypt.compare(password, passwordHash).then(passwordsMatch => {
          if (passwordsMatch) {
            // Create JWT Tokens
            const accessJWT = createAccessJWT(user);
            const refreshJWT = createRefreshJWT(user);

            // Send Tokens back
            res.json({
              status: 200,
              message: 'User Logged In',
              data: {
                accessToken: accessJWT,
                refreshToken: refreshJWT
              }
            });
          } else {
            res.json({
              status: 401,
              message: 'Incorrect Email or Password'
            });
          }
        });
      } else {
        res.json({ status: 404, message: 'User Not Found' });
      }
    })
    .catch(err => {
      res.json({ status: 500, message: 'A Server Error Occured' });
    });
});

module.exports = router;
