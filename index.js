if (process.env.NODE_ENV != 'production') require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const expressGeoIP = require('express-geoip');
const index = require('./routes');
const api = require('./routes/api');
const newPost = require('./routes/newPost');
const { checkUrl } = require('./middlewares');
const app = express();
const config = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose.connect(process.env.MONGODB, config);
app.listen(process.env.PORT || 5000);

app.use(expressGeoIP('US').getCountryCodeMiddleware);
app.use(checkUrl);
app.set('view engine', 'pug');
app.use(express.static('./public'));
app.use('/', index);
app.use('/api', api)
app.use('/newPost', newPost)
