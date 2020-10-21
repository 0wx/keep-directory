module.exports = (req, res, next) => {
  let { originalUrl, hostname } = req;
  if (hostname.match(/.+herokuapp.+/i)) {
    res.redirect('https://keep.directory' + originalUrl);
  } else {
    next();
  }
};
