process.env.NODE_ENV = 'test';
process.env.CONFIG = __dirname + '/index.js';

expect = require('expect.js');

config = module.exports = {
   twitter: {
        id: 'testing'
      , key: 'testing'
    }
  , models: __dirname + '/support/models'
};
