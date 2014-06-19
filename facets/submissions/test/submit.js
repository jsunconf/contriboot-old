var Lab = require('lab'),
  describe = Lab.experiment,
  before = Lab.before,
  it = Lab.test,
  expect = Lab.expect,
  path = require('path');

var Hapi = require('hapi'),
    submission = require('../');

submission.name = 'submission';
submission.version = '0.0.1';

var settings = {
  views: {
    engines: {
      hbs: 'handlebars'
    },
    path: path.resolve(__dirname, '..', 'views')
  }
};

var options = {url: '/interests/'},
    server;

var fakeData = require('./fixtures/ci.json');

before(function (done) {
  server = Hapi.createServer();
  server.pack.register(submission, settings, done);

  // mock couch call
  server.methods.getSubmissionById = function (id, next) {
    return next(null, fakeData.rows[5].value);
  };
});

describe('interests', function () {
  it('displays interest headline', function (done) {
    server.inject(options, function (resp) {
      expect(resp.result).to.contain('<h2>JavaScript MVC</h2>');
      done();
    });
  });

  it('responds with a 404 status code if interest does not exist', function (done) {
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
