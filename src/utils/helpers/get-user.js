const Promise = require('bluebird');

// Imports the Google Cloud client library
const { Datastore } = require('@google-cloud/datastore');

// The kind for the new entity
const kind = 'User';

// Creates a client
const datastore = new Datastore({ namespace: 'USERS' });

function getUserByEmail(email) {
  return new Promise((resolve, reject) => {
    const query = datastore.createQuery('User').filter('email', email);

    datastore.runQuery(query, (err, user) => {
      if (err) {
        reject(err);
      } else {
        if (user.length > 0) {
          resolve(user[0]);
        } else {
          resolve(null);
        }
      }
    });
  });
}

module.exports = getUserByEmail;
