const express = require('express');
const router = express.Router();
const { updateMain } = require('../lib');
router.get('/', (req, res) => {
  res.json({ ok: true });
});

router.get('/update', (req, res) => {
  updateMain().then((data) => res.status(data.status).json(data));
});

module.exports = router;
