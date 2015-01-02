var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    after = Lab.after,
    it = Lab.test,
    expect = Lab.expect,
    request = require('request'),
    bootServer = require('../../server.js'),
    config = require('../../config.js');

var server;
before(function (done) {
  bootServer(function (s) {
    server = s;
    done();
  });
});

after(function (done) {
  server.stop(done);
});

describe('Server', function () {
  it('sends csp headers', function (done) {
    request('http://' + config.host + ':' + config.port, function (err, res, body) {
      expect(res.headers['content-security-policy'])
        .to.equal("default-src 'none';script-src 'self';style-src 'self';img-src 'self';connect-src 'self';font-src 'self'");
      done();
    });
  });
});
