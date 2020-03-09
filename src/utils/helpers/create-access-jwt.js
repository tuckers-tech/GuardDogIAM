const Promise = require('bluebird');

const jwt = require('jsonwebtoken');

const uuid = require('uuid/v4');

// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore({ namespace: 'USERS' });

function createAccessJWT(user) {
  // Make the JWT to send back to the browser

  // TODO(TUCKER) - for production change this to like an hour instead of 1 min
  // TODO(TUCKER) - Change the role to properly reflect an admin if the user loggin in is one
  return jwt.sign(
    {
      data: {
        userID: user[datastore.KEY].name,
        username: user.username,
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        role: ['user']
      }
    },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m', jwtid: uuid() }
  );
}

module.exports = createAccessJWT;
