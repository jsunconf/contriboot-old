var Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    it = Lab.test,
    expect = Lab.expect,
    path = require('path');

var Hapi = require('hapi'),
    submission = require('../');

var server;
before(function (done) {
  server = Hapi.createServer();
  server.pack.register(submission, done);
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
    function testWithEmptyField (fieldName, done) {
      var payload = {
        title: 'sdfdfdsfgdsfg',
        name: 'sdfdfdsfgdsfg',
        description: 'dsfgdfsgdfsg'
      };

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
  });
});
