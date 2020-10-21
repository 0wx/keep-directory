const express = require('express');
const router = express.Router();
router.get('/', (req, res) => {
  res.json({ ok: true });
});

router.post('/', (req, res) => {
  res.json({ ok: true, body: req.body });
});
module.exports = router;
