const express = require('express');
const router = express.Router();
const { updateMain, getArticle } = require('../lib');
const { Submission } = require('../models');
router.get('/', (req, res) => {
  res.json({ ok: true });
});

router.get('/all', (req, res) => {
  getArticle.all()
  .then(data => res.json(data))
  .catch(e => {
    console.log(e);
    res.status(500).json({ok: false, message: e.message})
  });
});

router.get('/update', (req, res) => {
  updateMain()
  .then((data) => res.status(data.status).json(data))
  .catch(e => {
    console.log(e);
    res.status(500).json({ok: false, message: e.message})
  });
});

router.get('/submission', (req, res) => {
  Submission.find({})
  .then(data => res.json(data))
  .catch(e => {
    console.log(e);
    res.status(500).json({ok: false, message: e.message})
  });
});

router.get('/submission/:id', (req, res) => {
  Submission.findById(req.params.id)
  .then(data => res.json(data))
  .catch(e => {
    console.log(e);
    res.status(500).json({ok: false, message: e.message})
  });
});

router.get('/user/:id', (req, res) => {
  Submission.find({id: req.params.id})
  .then(data => res.json(data))
  .catch(e => {
    console.log(e);
    res.status(500).json({ok: false, message: e.message})
  });
});
module.exports = router;
