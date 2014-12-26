var Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    expect = Lab.expect,
    sanitizePayLoad = require('../data.js').sanitizePayLoad;

describe('sanitizing payloads', function () {
  it('removes xss stuff', function (done) {
    var testPayload = {
      title: 'awesomesausage <script>alert("ente")</script>',
      name: 'foo',
      description: 'barafdsfsdfdsfdsfdsfdsfdsfdsfdsf',
      type: 'contribution'
    };

    var sanitized = sanitizePayLoad(testPayload);
    expect(sanitized.title).to.not.contain('alert');
    expect(sanitized.title).to.equal('awesomesausage ');
    done();
  });
});
