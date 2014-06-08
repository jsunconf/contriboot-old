var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    it = Lab.test,
    expect = Lab.expect;

var Hapi = require('hapi'),
    ci = require('../'),
    config = require('../../../config.js');

ci.name = 'ci';
ci.version = '0.0.1';

var settings = {
  views: config.server.views,
  siteInfo: config.siteInfo
};

var options = {url: '/'},
    server;

var fakeData = require('./fixtures/ci.json');

before(function (done) {
  server = Hapi.createServer();
  server.pack.register(ci, settings, done);

  // mock couch call
  server.methods.getContributionsAndInterests = function (next) {
    return next(null, fakeData);
  };
});

describe('Start page', function () {
  it('It displays interests', function (done) {
    server.inject(options, function (resp) {
      expect(resp.result).to.contain('JavaScript MVC');
      done();
    });
  });
});
