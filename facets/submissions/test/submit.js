var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    it = Lab.test,
    expect = Lab.expect,
    path = require('path');

var Hapi = require('hapi'),
    submission = require('../');

submission.name = 'submission';
submission.version = '0.0.1';

var settings = {
  views: {
    engines: {
      hbs: 'handlebars'
    },
    path: path.resolve(__dirname, '..', 'views')
  }
};

var server;
before(function (done) {
  server = Hapi.createServer();
  server.pack.register(submission, settings, done);
});

describe('interests', function () {
  it('takes interests as POST and calls the couch service', function (done) {

    var expected = {
      title: 'Mytitle',
      name: 'Myname',
      description: 'Mydescription',
      type: 'interest'
    };

    server.methods.saveSubmission = function (payload, next) {
      expect(payload).to.eql(expected);
      done();
    };

    server.inject({
      url: '/interests/',
      method: 'POST',
      payload: {
        title: 'Mytitle',
        name: 'Myname',
        description: 'Mydescription'
      }
    }, function (resp) {

    });
  });

  it('redirects to newly created interest', function (done) {
    var expectedId = '123';

    server.methods.saveSubmission = function (payload, next) {
      next(null, {id: expectedId})
    };

    server.inject({
      url: '/interests/',
      method: 'POST',
      payload: {}
    }, function (resp) {
      expect(resp.statusCode).to.equal(302);
      expect(resp.headers.location).to.contain('/interests/' + expectedId);

      done();
    });
  });
});
