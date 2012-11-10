/**
 * Module responsible for handling signups and user session population.
 * @class Auth.Router
 */

var config = require(process.env.CONFIG)
  , debug = require('debug')('app:auth')
  , authom = require('authom')
  , User = require(config.models).User;

module.exports = authom.app;
module.exports.logout = logout;
module.exports.populate = populate;

if (config.twitter) {
  debug('Setting up twitter');
  authom.createServer({
    service: "twitter", id: config.twitter.id, secret: config.twitter.key
  });
}

if (config.facebook) {
  debug('Setting up facebook');
  authom.createServer({
      service: "facebook"
    , id: config.facebook.id
    , secret: config.facebook.key
    , scope: config.facebook.scope || []
  });
}

authom
  .on('auth', handleAuth)
  .on('error', handleError);

/**
 * OAuth Success callback handler
 * @method
 * @private
 */

function handleAuth(req, res, data) {
  data.currentUser = req.currentUser && req.currentUser._id;

  User.authenticate(data, function (err, user) {
    if (err) {
      debug('Error logging in user:', err);
      return handleError(req, res);
    }

    req.session._userId = user._id;
    res.redirect(req.session.afterSignin || '/');

    return true;
  });

}

/**
 * OAuth Error callback handler
 * @method
 * @private
 */
function handleError(req, res) {
  res.redirect('/');
}

/**
 * Destroy's the current session and redirects back to '/'
 * @method
 */
function logout(req, res) {
  req.session = {};
  res.redirect('/');
}


/**
 * Populate the currently logged in user onto the req object
 * @method
 * @param {String} prop Property to set user to on req
 * @returns {Function} Connect middleware
 */
function populate(prop) {
  return function (req, res, next) {
    var userId = req.session._userId;

    if (userId) {
      User
        .findById(userId, function (err, user) {
          if (user) {
            req[prop] = user;
          } else {
            delete req.session._userId;
          }
          next();
        });
    } else {
      next();
    }
  }
}

if (process.env.NODE_ENV === 'test') {
  module.exports.authom = authom;
}
