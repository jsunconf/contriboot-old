var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect,
    fillOutSubmission = require('./helpers/fill-out-submission.js');


describe('XSS', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
  });

  it('removes script foo', helper.options, function (done) {
    var b = browser.get(url + '/contributions/new'),
        values = {
          title: '<script>alert("ente ente")</script>',
          name: '<script>alert("ente ente")</script>',
          description: '<script>alert("ente ente")</script>'
        };

    fillOutSubmission(b, values)
      .elementByTagName('body')
      .text()
      .then(function (value) {
        return expect(value).to.not.contain('alert');
      })
      .nodeify(done);
  });
});
