var path = !process.env.AUTH_COV
  ? './lib/'
  : './lib-cov/';

module.exports = require(path);
