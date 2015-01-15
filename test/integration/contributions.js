var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect,
    fillOutSubmission = require('./helpers/fill-out-submission-without-twittername.js');


describe('Contributions', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
  });

  it('allows to add Contributions', helper.options, function (done) {
    var b = browser.get(url + '/contributions/new');

    fillOutSubmission(b)
      .elementByTagName('body')
      .text()
      .then(function (value) {
        expect(value).to.contain('Ente Ente');
        expect(value).to.contain('Roebin');
        return expect(value).to.contain('ES6 Features');
      })
      .nodeify(done);
  });

  it('allows to add twitter usernames', helper.options, function (done) {
    var browserInstance = browser.get(url + '/contributions/new');

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

  it('the user gets a tweet button', helper.options, function (done) {
    var b = browser.get(url + '/contributions/new');

    fillOutSubmission(b)
      .elementByCssSelector('.tweetlink')
      .getAttribute('href')
      .then(function (value) {
        expect(value).to.not.contain('undefined');
        return expect(value).to.contain('I%20submitted%20a%20talk');
      })
    .nodeify(done);
  });
});
