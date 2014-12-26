var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect,
    fillOutSubmission = require('./helpers/fill-out-submission-without-twittername.js');


describe('Interests', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
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

  it('allows to add twitter usernames', helper.options, function (done) {
    var browserInstance = browser.get(url + '/interests/new');

    browserInstance
      .elementByName('twittername')
      .sendKeys('robinson_k');

    fillOutSubmission(browserInstance)
      .elementByTagName('body')
      .text()
      .then(function (value) {
        return expect(value).to.contain('@robinson_k');
      })
      .nodeify(done);
  });
});
