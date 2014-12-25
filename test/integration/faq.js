var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect;


describe('FAQ page', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
  });

  it('displays the faq', helper.options, function (done) {
    browser
      .get(url + '/faq')
      .elementByCssSelector('#submit-talk')
      .text()
      .then(function (value) {
        return expect(value).to.equal('How does submitting a talk work?');
      })
      .nodeify(done);
  });
});
