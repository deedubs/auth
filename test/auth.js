var auth = require('../');

describe('auth', function() {
  it('should export a main function', function() {
    expect(auth).to.be.a(Function);
  });

  describe('.logout', function() {
    it('should export a logout function', function() {
      expect(auth.logout).to.be.a(Function);
    });

    it('should remove the users session to redirect to /', function(done) {
      var req = {session: {}}
        , loggedOut = true;

      req.session.destroy = function() {
        loggedOut = true;
      };

      auth.logout(req, expectRedirectTo('/', function() {
        expect(loggedOut).to.be(true);
        done();
      }));
    });
  });

  it('should handle an error by redirecting to /', function(done) {
    var authom = auth.authom;

    authom.emit('error', {}, expectRedirectTo('/', done));
  });

  it('should be able to log in using oAuth', function(done) {
    var authom = auth.authom
      , req = {
            currentUser: {_id: 'awesome'}
          , session: {}
        };

    authom.emit('auth',req, expectRedirectTo('/', done), {});
  });

  it('should be able to catch an error logging in via oAuth', function(done) {
    var authom = auth.authom
      , req = {};

    authom.emit('auth',req, expectRedirectTo('/', done), {error: true});
  });
});


function expectRedirectTo(expectedPath, done) {
  return {
    redirect: function(path) {
      expect(path).to.be(expectedPath);
      done();
    }
  }
}
