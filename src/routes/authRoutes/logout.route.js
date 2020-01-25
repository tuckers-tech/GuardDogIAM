const express = require('express');

const router = express.Router();

router.post('/', (req, res) => {
  res.send('logut Route');
});

module.exports = router;
