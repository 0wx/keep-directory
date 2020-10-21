const express = require('express');
const router = express.Router();
const { lang } = require('../middlewares');
const { Submission } = require('../models');
const { getArticle, getLanguageList } = require('../lib');
router.use(lang);
router.get('/', async (req, res) => {
  let db = await Submission.find({}, { translateFrom: 1, _id: 0 });
  db = [...new Set(db.map(({ translateFrom }) => translateFrom))];
  let code = db.includes(req.language.code)
    ? req.language.code
    : `en?noentry=true&lang=${req.language.code}`;
  res.redirect(`/${code}`);
});
router.get('/:language', async (req, res) => {
  let data,
    { language } = req.params;
  let languagesList = await getLanguageList();
  let [news, dev, info, faq, blog] = await getArticle.all();
  if (language == 'en') {
    let others = await Submission.find({ translateFrom: 'en', other: true });
    data = {
      noentry: req.query.noentry || false,
      lang: req.query.lang || null,
			language: req.language,
      languagesList,
      tbtc: { news, dev, info, faq },
      keep: { blog },
      others: others.sort((a, b) => b.timestamp - a.timestamp),
    };
  } else {


    let map = ({ url, title }) => ({
      url,
      title,
      translate: selectedLang
        .filter((x) => x.matchUrl == url && !x.other)
        .sort((a, b) => b.timestamp - a.timestamp),
		});
		

    let selectedLang = await Submission.find({ translateFrom: language });
    news = news.map(map);
    dev = dev.map(map);
    info = info.map(map);
    faq = faq.map(map);
    blog = blog.map(map);

    let others = selectedLang
      .filter((x) => x.other)
      .sort((a, b) => b.timestamp - a.timestamp);
    data = {
      noentry: false,
			lang: null,
			language: req.language,
      languagesList,
      tbtc: { news, dev, info, faq },
      keep: { blog },
      others,
    };
  }
  res.render('index', data);
});
module.exports = router;
