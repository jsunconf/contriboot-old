var Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    expect = Lab.expect,
    sanitizeSubmissionPayLoad = require('../data.js').sanitizeSubmissionPayLoad;

describe('sanitizing payloads', function () {
  it('sanitizes twitter usernames', function (done) {
    var testPayload = {
      title: '<script>alert("ente")</script>',
      name: 'foo',
      description: 'barafdsfsdfdsfdsfdsfdsfdsfdsfdsf',
      type: 'contribution',
      twittername: '@robinson_k'
    };

    var sanitized = sanitizeSubmissionPayLoad(testPayload);
    expect(sanitized.twittername).to.not.contain('@');
    expect(sanitized.twittername).to.equal('robinson_k');
    done();
  });
});
