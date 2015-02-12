var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    afterEach = Lab.afterEach,
    it = Lab.test,
    expect = Lab.expect,
    config = require('../../../config.js'),
    getViewPath = config.getViewPath,
    mockDate = require('mockdate');

var Hapi = require('hapi'),
    submissions = require('../');

var server;
before(function (done) {
  server = new Hapi.Server();
  server.connection();
  server.register({
    register: submissions,
    options: getViewPath({
      views: config.server.views
    }, 'submissions')
  }, done);
});

describe('interests', function () {

  afterEach(function (done) {
    mockDate.reset();
    done();
  });

  it('takes interests as POST and calls the couch service', function (done) {

    // "freeze" global time to current, so it's the same time when evaluating
    // the expectation
    mockDate.set(new Date());

    var expected = {
      title: 'Mytitle',
      name: 'Myname',
      description: 'Mydescription',
      type: 'interest',
      created_on: new Date()
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
      next(null, {id: expectedId});
    };

    server.inject({
      url: '/interests/',
      method: 'POST',
      payload: {
        title: 'eeeeedddde',
        name: 'asdasdasdasdasda',
        description: 'asdasdasdasdasda'
      }
    }, function (resp) {
      expect(resp.statusCode).to.equal(302);
      expect(resp.headers.location).to.contain('/interests/' + expectedId);

      done();
    });
  });

  describe('validations', function () {
    function getPayload () {
      return {
        title: 'sdfdfdsfgdsfg',
        name: 'sdfdfdsfgdsfg',
        description: 'dsfgdfsgdfsg',
        twittername: 'robinson_k'
      };
    }

    function testWithEmptyField (fieldName, done) {
      var payload = getPayload();
      payload[fieldName] = '';

      server.inject({
        url: '/interests/',
        method: 'POST',
        payload: payload
      }, function (resp) {
        expect(resp.statusCode).to.equal(400);
        expect(resp.result.validation.keys).to.contain(fieldName);
        done();
      });
    }

    it('a title is required', function (done) {
      testWithEmptyField('title', done);
    });

    it('a description is required', function (done) {
      testWithEmptyField('description', done);
    });

    it('a name is required', function (done) {
      testWithEmptyField('name', done);
    });

    it('a twitter username is not required', function (done) {
      var payload = getPayload();
      delete payload.twittername;
      server.inject({
        url: '/interests/',
        method: 'POST',
        payload: payload
      }, function (resp) {
        expect(resp.statusCode).to.equal(302);
        done();
      });
    });

    it('adds a created_on field with current datetime to interest', function (done) {
      var currentDate = new Date(2000, 1, 1, 10, 10, 10);
      mockDate.set(currentDate);

      server.methods.saveSubmission = function (payload, next) {
        expect(payload.created_on).to.eql(currentDate);
        done();
      };

      server.inject({
        url: '/contributions/',
        method: 'POST',
        payload: {
          title: 'Mytitle',
          name: 'Myname',
          description: 'Mydescription'
        }
      }, function (resp) {

      });
    });

  });
});
