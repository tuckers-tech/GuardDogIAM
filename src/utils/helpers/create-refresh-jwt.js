const Promise = require('bluebird');

const jwt = require('jsonwebtoken');

const uuid = require('uuid/v4');

// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore({ namespace: 'USERS' });

function createRefreshJWT(user) {
  // Make the JWT to send back to the browser
  return jwt.sign(
    {
      data: {
        userID: user[datastore.KEY].name
      }
    },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d', jwtid: uuid() }
  );
}

module.exports = createRefreshJWT;
