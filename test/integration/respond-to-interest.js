var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect,
    fillOutSubmission = require('./helpers/fill-out-submission.js');


describe('Respond to interest', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
  });

  it('allows to respond to an interest', helper.options, function (done) {
    var b = browser
      .get(url + '/')
      .elementByLinkText('This interest gets a response')
      .click()
      .elementByCssSelector('.respond-with-talk')
      .click()
      .elementByCssSelector('.respond-to-interest')
      .text()
      .then(function (value) {
        return expect(value).to.contain('This interest gets a response');
      });

      fillOutSubmission(b)
        .elementByCssSelector('.respond-to-doc')
        .text()
        .then(function (value) {
          return expect(value).to.contain('This interest gets a response');
        })
      .nodeify(done);
  });
});
