const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Promise = require('bluebird');
const uuid = require('uuid/v4');

const saltRounds = 12;

// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore({ namespace: 'USERS' });

// Import Helper Functions
const validateEmail = require('../../utils/helpers/check-email');
const validateUsername = require('../../utils/helpers/check-username');
const getUserByEmail = require('../../utils/helpers/get-user');
const createAccessJWT = require('../../utils/helpers/create-access-jwt');
const createRefreshJWT = require('../../utils/helpers/create-refresh-jwt');

const router = express.Router();

router.post('/', (req, res) => {
  if (
    !req.body.email ||
    !req.body.username ||
    !req.body.password ||
    !req.body.fname ||
    !req.body.lname
  ) {
    res.json({ status: 401, message: 'Missing Data' });
  }

  // Get the email, username, and password
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const fname = req.body.fname;
  const lname = req.body.lname;
  const terms = req.body.terms === 'true' ? true : false;

  if (!terms) {
    console.log('here');
    res.json({ status: 409, message: 'Terms Must Be Accepted' });
  } else {
    Promise.join(
      validateEmail(email),
      validateUsername(username),
      (emailExists, usernameExists) => {
        if (emailExists) {
          // Email is not valid
          res.json({ status: 409, message: 'Email Already Exists' });
        } else if (usernameExists) {
          // Username is not valid
          res.json({ status: 409, message: 'Username Already Exists' });
        } else {
          // All Parts are Valid
          bcrypt
            .hash(password, saltRounds)
            .then(hash => {
              // Generate The Cloud Datastore key for the new entity
              const userKey = datastore.key(['User', uuid()]);

              // Prepares the new entity
              const user = {
                key: userKey,
                data: {
                  fname: fname,
                  lname: lname,
                  email: email,
                  username: username,
                  passwordHash: hash
                }
              };

              // Save the new user
              datastore
                .insert(user)
                .then(user => {
                  // Get the user information
                  getUserByEmail(email)
                    .then(user => {
                      const accessJWT = createAccessJWT(user);
                      const refreshJWT = createRefreshJWT(user);
                      res.json({
                        status: 201,
                        message: 'User Created',
                        data: {
                          accessToken: accessJWT,
                          refreshToken: refreshJWT
                        }
                      });
                    })
                    .catch(err => {
                      res.json({
                        status: 500,
                        message: 'Internal Server Error'
                      });
                    });
                })
                .catch(err => {
                  console.error(err);
                  res.json({
                    status: 500,
                    message: 'unable to create user'
                  });
                });
            })
            .catch(err => {
              console.error(err);
              res.json({ status: 500, message: 'Server Error' });
            });
        }
      }
    );
  }
});

module.exports = router;
