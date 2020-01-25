const express = require('express');
const validateUsername = require('../../utils/helpers/check-username');

// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

// The kind for the new entity
const kind = 'User';

// Creates a client
const datastore = new Datastore({ namespace: 'USERS' });

const router = express.Router();

router.post('/', (req, res) => {
  const usernameToCheck = req.body.username;

  validateUsername(usernameToCheck)
    .then(userExists => {
      if (userExists) {
        res.json({ status: 409, message: 'Username already exists' });
      } else {
        res.json({ status: 404, message: 'Username does not exist' });
      }
    })
    .catch(err => {
      console.error(err);
      res.json({ status: 500, message: 'Server Error' });
    });
});

module.exports = router;
