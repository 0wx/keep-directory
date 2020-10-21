module.exports = (req, res, next) => {
  if (req.headers.authorization != process.env.BOT) {
    res
      .status(403)
      .json({
        ok: false,
        message: 'You do not have permission to access this endpoint',
      });
  } else next();
};
