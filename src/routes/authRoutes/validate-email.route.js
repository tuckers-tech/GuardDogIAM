const express = require('express');
const validateEmail = require('../../utils/helpers/check-email');

// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

// The kind for the new entity
const kind = 'User';

// Creates a client
const datastore = new Datastore({ namespace: 'USERS' });

const router = express.Router();

router.post('/', (req, res) => {
  const emailToCheck = req.body.email;

  validateEmail(emailToCheck)
    .then(emailExists => {
      if (emailExists) {
        res.json({ status: 401, message: 'Email already exists' });
      } else {
        res.json({ status: 404, message: 'Email does not exist' });
      }
    })
    .catch(err => {
      console.error(err);
      res.json({ status: 500, message: 'Server Error' });
    });
});

module.exports = router;
