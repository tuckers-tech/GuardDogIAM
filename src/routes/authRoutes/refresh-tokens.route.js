const createAccessJWT = require('../../utils/helpers/create-access-jwt');
const createRefreshJWT = require('../../utils/helpers/create-refresh-jwt');

// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

// Creates a client
const datastore = new Datastore({ namespace: 'USERS' });

const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  // TODO(TUCKER) - Check that the token hasn't been blacklisted and that it is still valid
  const key = datastore.key({
    namespace: 'USERS',
    path: ['User', req.refreshTokenValue.data.userID]
  });

  datastore
    .get(key)
    .then(user => {
      if (true) {
        const accessJWT = createAccessJWT(user[0]);
        const refreshJWT = createRefreshJWT(user[0]);

        // Send Tokens back
        res.json({
          status: 200,
          message: 'Tokens Refreshed',
          data: {
            accessToken: accessJWT,
            refreshToken: refreshJWT
          }
        });
      } else {
        // Handle the blacklisted token
      }
    })
    .catch(err => {
      console.log(err);
    });
});

module.exports = router;
