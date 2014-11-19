var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect,
    fillOutSubmission = require('./helpers/fill-out-submission.js');


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
});
