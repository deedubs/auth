module.exports = {}

module.exports.authenticate = function(data, done) {
  if (data.error) return done('Error');

  done(null, {_id: 1});
};