var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    it = Lab.test,
    expect = Lab.expect;

var Hapi = require('hapi'),
    about = require('../'),
    config = require('../../../config.js');

about.name = 'user';
about.version = '0.0.1';

var settings = {
  views: config.server.views,
  siteInfo: config.siteInfo
};

var options = {url: '/imprint'},
server;

before(function (done) {
  server = Hapi.createServer();
  server.pack.register(about, settings, done);
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
