var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect,
    fillOutSubmission = require('./helpers/fill-out-submission-without-twittername.js');


describe('Index page', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
  });

  it('Contributions are visible on the index right after creation', helper.options, function (done) {
    var b = browser.get(url + '/contributions/new');

    fillOutSubmission(b, {title: 'Caching node.js applications'})
      .get(url + '/')
      .elementByTagName('body')
      .text()
      .then(function (value) {
        expect(value).to.contain('Contributions');
        expect(value).to.contain('Interests');

        return expect(value).to.contain('Caching node.js applications');
      })

      .nodeify(done);
  });

  it('Interests are visible on the index right after creation', helper.options, function (done) {
    var b = browser.get(url + '/interests/new');

    fillOutSubmission(b, {title: 'Caching node.js applications'})
      .get(url + '/')
      .elementByTagName('body')
      .text()
      .then(function (value) {
        expect(value).to.contain('Contributions');
        expect(value).to.contain('Interests');

        return expect(value).to.contain('Caching node.js applications');
      })

      .nodeify(done);
  });
});
