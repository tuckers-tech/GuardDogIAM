const Promise = require('bluebird');

// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

// The kind for the new entity
const kind = 'User';

// Creates a client
const datastore = new Datastore({ namespace: 'USERS' });

function userExists(usernameToCheck) {
  return new Promise((resolve, reject) => {
    const query = datastore
      .createQuery('User')
      .filter('username', usernameToCheck);

    datastore.runQuery(query, (err, entities) => {
      if (err) {
        reject(err);
      } else {
        if (entities.length > 0) {
          resolve(true);
        } else {
          resolve(false);
        }
      }
    });
  });
}

module.exports = userExists;
