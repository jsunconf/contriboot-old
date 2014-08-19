var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect,
    path = require('path');


describe('Start page', function () {
  var browser;
  before(function (done) {
    helper.s.start(function () {
      browser = helper.init();
      done();
    });
  });
  after(function (done) {
    browser.quit(function () {
      helper.s.stop(done);
    });
  });
  it('displays interests', helper.options, function (done) {
    browser
      .get(url + '/')
      .elementByTagName('a')
      .text()
      .then(function (value) {
         return expect(value).to.equal('JS as compilation target');
      })
      .nodeify(done);
  });
});
