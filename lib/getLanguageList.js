const { Submission } = require('../models');
let cache;
module.exports = async () => {
  if (!cache || cache.time < Date.now()) {
    let data = await Submission.find({});
    data = [
      'en',
      ...[...new Set(data.map((x) => x.translateFrom))]
        .filter((x) => x != 'en')
        .sort(),
    ];
    cache = {
      time: Date.now() + 300000,
      data: data.map((x) => {
        return { code: x, ...require('../src/language.json')[x] };
      }),
    };
  }

  return cache.data;
};
