var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    it = Lab.test,
    expect = Lab.expect;

var Hapi = require('hapi'),
    ci = require('../');

var options = {url: '/interests/someid'},
    server;

var fakeData = require('./fixtures/ci.json');

before(function (done) {
  server = Hapi.createServer();
  server.pack.register(ci, done);

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
