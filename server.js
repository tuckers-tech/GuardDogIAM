// Load the Environment Variables
const dotenv = require('dotenv');
dotenv.config();

// Create an express App
const express = require('express');
const app = express();
const helmet = require('helmet');
const bearerToken = require('express-bearer-token');

// Load parsing mechanisms
const bodyParser = require('body-parser');

// Load Cors
const cors = require('cors');

// Get Port from env variables
const PORT = process.env.PORT || process.env.SERVER_PORT;

// Init Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use(helmet());
app.use(bearerToken());

// Load routes
const routes = require('./src/routes/routes');

// Register Routes
app.get('/', (req, res) => {
  res.send('Heartbeat Active');
});

app.use('/', routes);

app.listen(PORT, () => {
  console.log(`App Listening on PORT ${PORT}`);
});
