/**
 * This file is a middleware function for getting the user based on the id in the valid token
 */

const Promise = require('bluebird');

// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

// The kind for the new entity
const kind = 'User';

// Creates a client
const datastore = new Datastore({ namespace: 'USERS' });

const jwt = require('jsonwebtoken');

function ValidJWTAccessToken(req, res, next) {
  const userID = req.accessTokenValue.data.userID;

  const key = datastore.key({
    namespace: 'USERS',
    path: ['User', userID]
  });
  datastore
    .get(key)
    .then(user => {
      req.user = user;
      next();
    })
    .catch(err => {
      console.log(err);
    });
}

module.exports = ValidJWTAccessToken;
