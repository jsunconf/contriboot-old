var Lab = require('lab'),
  describe = Lab.experiment,
  before = Lab.before,
  it = Lab.test,
  expect = Lab.expect,
  path = require('path');

var Hapi = require('hapi'),
  ci = require('../');

ci.name = 'ci';
ci.version = '0.0.1';

var settings = {
  views: {
    engines: {
      hbs: 'handlebars'
    },
    path: path.resolve(__dirname, '..', 'views')
  }
};

var options = {url: '/contributions/someid'},
  server;

var fakeData = require('./fixtures/ci.json');

before(function (done) {
  server = Hapi.createServer();
  server.pack.register(ci, settings, done);

  // mock couch call
  server.methods.getSubmissionById = function (id, next) {
    return next(null, fakeData.rows[0].value);
  };
});

describe('contributions', function () {
  it('displays contributions headline', function (done) {
    server.inject(options, function (resp) {
      expect(resp.result).to.contain('<h2>npm</h2>');
      done();
    });
  });

  it('responds with a 404 status code if contribution does not exist', function (done) {
    // mock couch call
    server.methods.getSubmissionById = function (id, next) {
      return next(null, '{"error":"not_found","reason":"missing"}');
    };

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(404);
      done();
    });
  });
});
