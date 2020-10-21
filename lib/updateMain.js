const { MainArticle } = require('../models');
const get = require('./getUpdate');

module.exports = async () => {
  try {
    let all = await get.all();
    let db = await MainArticle.findOne({ type: 'all' });
    
    if (!db) {
      let post = new MainArticle(all);
      let response = await post.save();
      return {
        ok: true,
        status: 200,
        update: true,
        message: "Initial Update!",
        response,
      };
    } else if (all.results.flat().length - db.results.flat().length < 1) {
      return {
        ok: true,
        status: 200,
        update: false,
        message: 'No new link to update',
        response: {},
      };
    } else {
      let response = await MainArticle.findOneAndUpdate({ type: 'all' }, all);
      return {
        ok: true,
        status: 200,
        update: true,
        message: "There's new link and be updated!",
        response,
      };
    }
  } catch (e) {
    console.log(e);
    require('fs').writeFileSync('./errlog.txt', e);
    return {
      ok: false,
      status: 500,
      update: false,
      message: 'failed to update, check log please',
      response: {},
    };
  }
};
