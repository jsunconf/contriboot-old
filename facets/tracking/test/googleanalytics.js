const SOME_GA_UA_CODE = 'dkldfjklfd';

var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    it = Lab.test,
    expect = Lab.expect;

var Hapi = require('hapi'),
    tracking = require('../');

var options = {url: '/tracking/googleanalytics.js'},
    server;

before(function (done) {
  server = new Hapi.Server();
  server.connection();
  server.register({
    register: tracking,
    options: {
      googleAnalyticsUaCode: SOME_GA_UA_CODE
    }
  }, done);
});

describe('google analytics', function () {
  it('response with javascript content type', function (done) {
    server.inject(options, function (response) {
      var contentType = response.headers['content-type'];
      expect(contentType).to.equal('application/javascript; charset=utf-8');
      done();
    });
  });

  it('should contain google analytics ga code', function (done) {
    server.inject(options, function (response) {
      expect(response.result).to.contain(SOME_GA_UA_CODE);
      done();
    });
  });

  it('should contain some google analytics code', function (done) {
    server.inject(options, function (response) {
      // ensure ga functions are called - smoke test
      expect(response.result).to.contain('ga(');
      done();
    });
  });
});
