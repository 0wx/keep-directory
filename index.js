if (process.env.NODE_ENV != 'production') require('dotenv').config();

const { Submission } = require('./models');
const { getArticle, getLanguageList } = require('./lib');
const express = require('express');
const mongoose = require('mongoose');
const expressGeoIP = require('express-geoip');
const api = require('./routes/api');
const newPost = require('./routes/newPost');
const { lang, checkUrl } = require('./middlewares');
const app = express();
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB, config);
app.listen(process.env.PORT || 5000);

app.use(expressGeoIP('US').getCountryCodeMiddleware);
app.use(checkUrl);
app.use(lang);

app.set('view engine', 'pug');
app.use(express.static('./public'));/
app.use('/api', api)
app.use('/newPost', newPost)

app.get('/', async (req, res) => {
  let db = await Submission.find({}, { translateFrom: 1, _id: 0 });
  db = [...new Set(db.map(({ translateFrom }) => translateFrom))];
  let code = db.includes(req.language.code)
    ? req.language.code
    : `en?noentry=true&lang=${req.language.code}`;
  res.redirect(`/${code}`);
});

app.get('/:language', async (req, res) => {

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
