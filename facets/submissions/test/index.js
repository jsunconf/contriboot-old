var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    it = Lab.test,
    expect = Lab.expect,
    config = require('../../../config.js'),
    getViewPath = config.getViewPath;

var Hapi = require('hapi'),
    submissions = require('../');

var options = {url: '/'},
    server;

var fakeData = require('./fixtures/ci.json');

before(function (done) {
  server = Hapi.createServer();
  server.pack.register({
    plugin: submissions,
    options: getViewPath({
      views: config.server.views
    }, 'submissions')
  }, done);
  // mock couch call
  server.methods.getContributionsAndInterests = function (next) {
    return next(null, fakeData);
  };
});

describe('Start page', function () {
  it('displays interests', function (done) {
    server.inject(options, function (resp) {
      expect(resp.result).to.contain('JavaScript MVC');
      done();
    });
  });
  it('displays contributions', function (done) {
    server.inject(options, function (resp) {
      expect(resp.result).to.contain('JavaScript Patterns');
      done();
    });
  });
});
