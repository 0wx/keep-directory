const express = require('express');
const router = express.Router();
const { Submission } = require('../models');
router.get('/', (req, res) => {
  res.json({ ok: true });
});

router.post('/', async(req, res) => {
  if(req.headers['x-auth'] == process.env.BOT) {
	  let response = await Submission.findOne({url: req.body.url});

	  if(response) {
		  res.status(200).json({ok: false, message: 'data exist'});
	  } else {
		  let post = new Submission(req.body);
		  await post.save();
		  res.status(200).json({ok: true, message: 'data added'});
	  }
  } else {
	res.status(403).json({ ok: false});
  }

});
module.exports = router;
