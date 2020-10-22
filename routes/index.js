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
  if(language.length > 2 || !require('../src/language.json')[language]) {
    res.render('404');
  }
  else if (language == 'en') {
    let others = await Submission.find({ translateFrom: 'en', other: true });
    let translateAll = await Submission.find({ other: false });
    let map = ({ url, title }) => ({
      url,
      title,
      translate: translateAll
        .filter((x) => x.matchUrl == url && !x.other)
        .sort((a, b) => b.timestamp - a.timestamp),
    });
    news = news.map(map);
    dev = dev.map(map);
    info = info.map(map);
    faq = faq.map(map);
    blog = blog.map(map);

    data = {
      noentry: false,
      lang: null,
      language: {
        code: language,
        ...require('../src/language.json')[language],
      },
      languagesList,
      tbtc: { news, dev, info, faq },
      keep: { blog },
      others,
    };
  } else {
    let selectedLang = await Submission.find({ translateFrom: language });

    let map = ({ url, title }) => ({
      url,
      title,
      translate: selectedLang
        .filter((x) => x.matchUrl == url && !x.other)
        .sort((a, b) => b.timestamp - a.timestamp),
    });

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
      language: {
        code: language,
        ...require('../src/language.json')[language],
      },
      languagesList,
      tbtc: { news, dev, info, faq },
      keep: { blog },
      others,
    };
  }
  res.render('index', data);
});

router.get('/tes', (req, res) => {
  res.render('index', require('fs').readFileSync('./src/sample.json'));
});
module.exports = router;
