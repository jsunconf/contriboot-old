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

describe('contributions', function () {

  afterEach(function (done) {
    mockDate.reset();
    done();
  });

  it('takes contributions as POST and calls the couch service', function (done) {
    // "freeze" global time to current, so it's the same time when evaluating
    // the expectation
    mockDate.set(new Date());

    var expected = {
      title: 'Mytitle',
      name: 'Myname',
      description: 'Mydescription',
      type: 'contribution',
      createdOn: new Date()
    };

    server.methods.saveSubmission = function (payload, next) {
      expect(payload).to.eql(expected);
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

  it('redirects to newly created interest', function (done) {
    var expectedId = '123';

    server.methods.saveSubmission = function (payload, next) {
      next(null, {id: expectedId});
    };

    server.inject({
      url: '/contributions/',
      method: 'POST',
      payload: {
        title: 'eeeeedddde',
        name: 'asdasdasdasdasda',
        description: 'asdasdasdasdasda'
      }
    }, function (resp) {
      expect(resp.statusCode).to.equal(302);
      expect(resp.headers.location).to.contain('/contributions/' + expectedId);

      done();
    });
  });

  describe('validations', function () {
    function getPayload () {
      return {
        title: 'sdfdfdsfgdsfg',
        name: 'sdfdfdsfgdsfg',
        description: 'dsfgdfsgdfsg',
        interest: 'foobar',
        twittername: 'robinson_k'
      };
    }

    function testWithEmptyField (fieldName, done) {
      var payload = getPayload();
      payload[fieldName] = '';

      server.inject({
        url: '/contributions/',
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

    it('an interest is not required', function (done) {
      var payload = getPayload();
      delete payload.interest;
      server.inject({
        url: '/contributions/',
        method: 'POST',
        payload: payload
      }, function (resp) {
        expect(resp.statusCode).to.equal(302);
        done();
      });
    });

    it('a twitter username is not required', function (done) {
      var payload = getPayload();
      delete payload.twittername;
      server.inject({
        url: '/contributions/',
        method: 'POST',
        payload: payload
      }, function (resp) {
        expect(resp.statusCode).to.equal(302);
        done();
      });
    });

    it('adds a createdOn field with current datetime to contribution', function (done) {
      var currentDate = new Date(2000, 1, 1, 10, 10, 10);
      mockDate.set(currentDate);

      server.methods.saveSubmission = function (payload, next) {
        expect(payload.createdOn).to.eql(currentDate);
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
