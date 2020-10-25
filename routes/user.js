const express = require('express');
const router = express.Router();
const { Submission } = require('../models');
router.get('/:id', async(req, res) => {
  let userId = req.params.id;

  let response = await Submission.find({id: +userId});

  if(!response.length) {
    res.render('404');
  } else {

    let data = {
      name: `${response[0].name}#${response[0].discriminator}`,
      avatarUrl: response[0].avatarUrl,
      articles: response,
    };
    res.render('user', data)
  }
});

module.exports = router;
