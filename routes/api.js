const express = require('express');
const router = express.Router();
const { updateMain, getArticle } = require('../lib');
router.get('/', (req, res) => {
  res.json({ ok: true });
});

router.get('/all', (req, res) => {
  getArticle.all().then(res.json);
});

router.get('/update', (req, res) => {
  updateMain().then((data) => res.status(data.status).json(data));
});

module.exports = router;
