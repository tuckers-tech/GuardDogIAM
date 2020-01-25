const express = require('express');

const router = express.Router();
const ValidateJWTAccessToken = require('../middleware/ValidJWTAccessToken.middleware');
const ValidateJWTRefreshToken = require('../middleware/ValidJWTRefreshToken.middleware');
const getUserByTokenID = require('../middleware/getUserByTokenID.middleware');

const loginRoute = require('./authRoutes/login.route');
const logoutRoute = require('./authRoutes/logout.route');
const registerRoute = require('./authRoutes/register.route');
const refreshTokensRoute = require('./authRoutes/refresh-tokens.route');
const validateUsernameRoute = require('./authRoutes/validate-username.route');
const validateEmailRoute = require('./authRoutes/validate-email.route');

// These routes do not need authentication
router.use('/login', loginRoute);
router.use('/register', registerRoute);
router.use('/validate-username', validateUsernameRoute);
router.use('/validate-email', validateEmailRoute);

// This route needs to be authorized the refresh token as well so it can
// invalidate the token on the database
router.use('/logout', ValidateJWTRefreshToken, logoutRoute);

// When this route is used, the access token will be expired
// So we need to validate the refresh token instead
router.use('/refresh-tokens', ValidateJWTRefreshToken, refreshTokensRoute);

module.exports = router;
