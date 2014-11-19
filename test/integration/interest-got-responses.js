var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect,
    wd = require('wd');

describe('Respond to interest', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
  });

  // the documents are bootstrapped
  it('displays responses to an interest', helper.options, function (done) {
    browser
      .get(url + '/')
      .elementByLinkText('This interest gets two responses')
      .click()
      .elementsByCssSelector('.response-to-interest')
      .then(function (elements) {
        return expect(elements.length).to.equal(2);
      })
      .elementsByCssSelector('.response-to-interest')
      .then(function (elements) {
        var Q = wd.Q;

        return Q.all([
          elements[0].text()
            .then(function (value) {
              return expect(value).to.contain('ES6 Features you can use today');
            }),
          elements[1].text()
            .then(function (value) {
              return expect(value).to.contain('My life as JS Dev');
            })
        ]);
      })
      // check that responsed are properly linked
      .elementByLinkText('ES6 Features you can use today')
      .click()
      .elementsByCssSelector('h2')
      .text()
      .then(function (value) {
        return expect(value).to.contain('ES6 Features you can use today');
      })
      .nodeify(done);
  });
});
