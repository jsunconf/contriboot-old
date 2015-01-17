var Lab = require('lab'),
  describe = Lab.experiment,
  beforeEach = Lab.beforeEach,
  it = Lab.test,
  expect = Lab.expect,
  config = require('../../../config.js'),
  getViewPath = config.getViewPath;

var Hapi = require('hapi'),
    submissions = require('../');

var options = {url: '/contributions/someid'},
  server;

var fakeData = require('./fixtures/ci.json');


describe('contributions', function () {

  beforeEach(function (done) {
    server = new Hapi.Server();
    server.connection();
    server.register({
      register: submissions,
      options: getViewPath({
        views: config.server.views
      }, 'submissions')
    }, done);

    // mock couch call
    server.methods.getSubmissionById = function (id, next) {
      return next(null, fakeData.rows[0].value);
    };

    server.methods.getVotesbySubmissionId = function (id, next) {
      return next(null, 0);
    };
  });

  it('displays contributions headline', function (done) {
    server.inject(options, function (resp) {
      expect(resp.result).to.contain('<h2>npm</h2>');
      done();
    });
  });

  it('responds with a 404 status code if contribution does not exist', function (done) {
    // mock couch call
    server.methods.getSubmissionById = function (id, next) {
      return next(null, '{"error":"not_found","reason":"missing"}');
    };

    server.inject(options, function (resp) {
      expect(resp.statusCode).to.equal(404);
      done();
    });
  });

  it('renders description markdown as html', function (done) {

    var submissionWithMarkdown = {
      description: "## Happiness galore!!1",
      _id: 'someid'
    };

    server.methods.getSubmissionById = function (id, next) {
      return next(null, submissionWithMarkdown);
    };

    server.inject(options, function (resp) {
      expect(resp.result).to.contain('<h2>Happiness galore!!1</h2>');
      done();
    });
  });
});
