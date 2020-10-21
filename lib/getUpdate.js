const axios = require('axios');
const tbtc = {
  url: 'https://tbtc.network',
  news: 'https://tbtc.network/news',
  dev: 'https://tbtc.network/developers',
  info: 'https://tbtc.network/about',
  faq: 'https://tbtc.network/faq',
};
const keep = {
  url: 'https://keep.network',
  blog: 'https://blog.keep.network/',

  /*
    It's better get cached somewhere after 
    request this, because it's about 1.4 MB
    response size, lmao. 
  */
  posts: 'https://blog.keep.network/latest?format=json&limit=1000',
};
const get = {
  tbtc: {
    news: async (lang) => {
      let { data } = await axios.get(tbtc.news);
      lang = lang ? `/${lang}` : '';
      return data
        .replace(/[\n\t]/g, '')
        .split(
          '<section class="col-sm-12 col-md-12 col-lg-10"><div class="news-list-item">'
        )[1]
        .split('</div></section></div></div></div></div>')[0]
        .split('</div><div class="news-list-item">')
        .map((raw) => ({
          title: raw.replace(/.+<h2>(.+)<\/h2>.+/gi, '$1'),
          url: raw.replace(/.+<a href="(.+)">Read.+/gi, `${tbtc.url}${lang}$1`),
        }));
    },
    dev: async (lang) => {
      let { data } = await axios.get(tbtc.dev);
      lang = lang ? `/${lang}` : '';
      return [
        {
          title: 'Resource',
          url: `${lang}/developers`,
        },
        ...data
          .replace(/[\n\t]/g, '')
          .split('<ul class="sidebar"><li>')[1]
          .split('</li></ul><div class="body">')[0]
          .split('</li><li>')
          .filter((raw) => raw.indexOf('href') > -1)
          .map((raw) => ({
            title: raw.replace(/<a href="(.+)">(.+)<\/a>/g, '$2'),
            url: raw.replace(
              /<a href="(.+)">(.+)<\/a>/g,
              `${tbtc.url}${lang}$1`
            ),
          })),
      ];
    },
    info: async (lang) => [
      {
        title: 'About tBTC',
        url: `${tbtc.url}${lang ? `/${lang}` : ''}/about`,
      },
    ],
    faq: async (lang) => [
      {
        title: 'tBTC FAQ',
        url: `${tbtc.url}${lang ? `/${lang}` : ''}/faq`,
      },
    ],
  },
  keep: {
    blog: async () => {
      let { data } = await axios.get(keep.posts);
      data = JSON.parse(data.slice(data.indexOf('{'))).payload.posts;
      return data.map(({ uniqueSlug, title }) => ({
        title,
        url: keep.blog + uniqueSlug,
      }));
    },
  },
};

const all = async () => {
  let results = await Promise.all([
      get.tbtc.news(),
      get.tbtc.dev(),
      get.tbtc.info(),
      get.tbtc.faq(),
      get.keep.blog(),
    ]);
  
  let [news, dev, info, faq, blog] = results;
  return {
    data: {
      tbtc: { news, dev, info, faq },
      keep: { blog },
    },
    results,
  };
};

module.exports = { all, ...get };
