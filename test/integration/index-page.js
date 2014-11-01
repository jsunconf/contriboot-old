var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect;


describe('Start page', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
  });

  it('displays interests', helper.options, function (done) {
    browser
      .get(url + '/')
      .elementByCssSelector('ul.interests a')
      .text()
      .then(function (value) {
        return expect(value).to.equal('JS as compilation target');
      })
      .nodeify(done);
  });
});
