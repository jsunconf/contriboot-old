var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect,
    path = require('path');


describe('Interests', function () {
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
  it('allows to add interests', helper.options, function (done) {
    browser
      .get(url + '/interests/new')
      .elementByName('title')
      .sendKeys('rocko mag brot')
      .elementByName('name')
      .sendKeys('rocko artischocko')
      .elementByName('description')
      .sendKeys('this is the best talk')
      .elementByTagName('button')
      .click()
      .elementByTagName('body')
      .text()
      .then(function (value) {
         expect(value).to.contain('rocko artischocko');
         expect(value).to.contain('rocko mag brot');
         return expect(value).to.contain('this is the best talk');
      })
      .nodeify(done);
  });
});
