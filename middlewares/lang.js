const countries = require('../src/country.json');
const languages = require('../src/language.json');
const axios = require('axios');
const endpoint = 'http://ip-api.com/json/';
module.exports = async (req, res, next) => {
  let ip = req.socket.remoteAddress;
  console.log(ip)
  try {
    if (ip == '::ffff:127.0.0.1') {
      req.language = {
        code: 'id',
        name: 'Indonesian',
        native: 'Bahasa Indonesia',
      };
      next();
    } else {
      let { data } = await axios.get(endpoint + ip);
      req.language = {
        code: countries[data.countryCode].languages[0],
        ...languages[countries[data.countryCode].languages[0]],
      };
      next();
    }
  } catch (e) {
    console.log(e);
    req.language = {
      code: 'en',
      name: 'English',
      native: 'English',
    };
    next();
  }
};
