const express = require('express');
const router = express.Router();
const { updateMain, getArticle } = require('../lib');
router.get('/', (req, res) => {
  res.json({ ok: true });
});

router.get('/all', (req, res) => {
  getArticle.all().then(data => res.json(data));
});

router.get('/update', (req, res) => {
  updateMain().then((data) => res.status(data.status).json(data));
});

module.exports = router;
