var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect;


describe('Impressum', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
  });

  it('route to and display imprint', helper.options, function (done) {
    browser
      .get(url + '/imprint')
      .elementByCssSelector('h2')
      .text()
      .then(function (value) {
        return expect(value).to.equal('Impressum');
      })
      .nodeify(done);
  });
});
