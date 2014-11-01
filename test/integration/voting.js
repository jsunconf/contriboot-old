var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect;


describe('Voting', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
  });

  it('allows to upvote an interest', helper.options, function (done) {
    browser
      .get(url + '/')
      .elementByLinkText('JS as compilation target')
      .click()
      .elementByCssSelector('.vote-count')
      .text()
      .then(function (value) {
        return expect(value).to.equal('0');
      })
      .elementByCssSelector('.vote-button')
      .click()
      .elementByCssSelector('.vote-count')
      .text()
      .then(function (value) {
        return expect(value).to.equal('1');
      })
      .nodeify(done);
  });
});
