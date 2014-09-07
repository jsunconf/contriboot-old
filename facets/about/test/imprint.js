var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    it = Lab.test,
    expect = Lab.expect,
    config = require('../../../config.js'),
    getViewPath = config.getViewPath;

var Hapi = require('hapi'),
    about = require('../');

var options = {url: '/imprint'},
    server;

before(function (done) {
  server = Hapi.createServer();
  server.pack.register({
    plugin: about,
    options: getViewPath({
      views: config.server.views
    }, 'about')
  }, done);
});

describe('Imprint', function () {
  it('is routed properly', function (done) {
    var table = server.table();

    expect(table[0].settings.path).to.equal('/imprint');
    done();
  });

  it('contains the BOOT address', function (done) {
    server.inject(options, function (resp) {
      expect(resp.result).to.contain('Best Of Open Technologies e.V.');
      expect(resp.result).to.contain('Stresemanstrasse 375');
      expect(resp.result).to.contain('22761 Hamburg');
      done();
    });
  });

  it('contains the BOOT UstId', function (done) {
    server.inject(options, function (resp) {
      expect(resp.result).to.contain('DE284511032');
      done();
    });
  });
});
