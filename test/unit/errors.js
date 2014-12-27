
var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    after = Lab.after,
    it = Lab.test,
    expect = Lab.expect,
    request = require('request'),
    bootServer = require('../../server.js'),
    config = require('../../config.js');


describe('Server', function () {
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

  it('returns an error page with a 404 status code', function (done) {
    var url = 'http://' + config.host + ':' + config.port + '/i-will-never-exist';
    request(url, function (err, res, body) {
      expect(res.statusCode).to.equal(404);
      expect(body).to.contain('class="error-msg');
      done();
    });
  });
});
