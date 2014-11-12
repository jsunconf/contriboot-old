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

  function upvoteTestForSubmissionWithTitle(title, done) {
    browser
      .get(url + '/')
      .elementByLinkText(title)
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

      // expect immediate upvote ui update
      .then(function (value) {
        return expect(value).to.equal('1');
      })
      .sleep(1000)
      .refresh()
      .elementByCssSelector('.vote-count')
      .text()

      // expect count to be 1 even after reload
      .then(function (value) {
        return expect(value).to.equal('1');
      })

      // expect upvote button to be disabled
      // because users should not be able to vote the same
      // submission more than once
      .elementByCssSelector('.vote-button')
      .getAttribute('disabled')
      .then(function(value) {
        return expect(value).to.equal('true');
      })
      .nodeify(done);
  }

  it('allows to upvote an interest', helper.options, function (done) {
    upvoteTestForSubmissionWithTitle('JS as compilation target', done);
  });

  it('allows to upvote a contribution', helper.options, function (done) {
    upvoteTestForSubmissionWithTitle('JavaScript Patterns', done);
  });

});
