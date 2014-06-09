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
