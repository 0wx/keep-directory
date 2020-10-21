const { MainArticle } = require('../models');
module.exports = {
  all: async () => {
    let response = await MainArticle.findOne({ type: 'all' });
    return response.results;
  },
  tbtc: async () => {
    let response = await MainArticle.findOne({ type: 'all' });
    return response.data.tbtc;
  },
  keep: async () => {
    let response = await MainArticle.findOne({ type: 'all' });
    return response.data.keep;
  },
};
