var helper = require('./helpers/helper.js'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    before = Lab.before,
    after = Lab.after,
    expect = Lab.expect,
    fillOutSubmission = require('./helpers/fill-out-submission-without-twittername.js');


describe('XSS', function () {
  var browser;
  helper.testHelper(before, after, function (browserInstance, done) {
    browser = browserInstance;
    done();
  });

  //@see https://github.com/jsunconf/contriboot/issues/69
  it('allows to include constructs looking like html tags without prematurely ending the input', helper.options, function (done) {
    var b = browser.get(url + '/contributions/new'),
        values = {
          title: 'someTitle',
          name: 'someName',
          description: 'Awesome <5kb foo'
        };

    fillOutSubmission(b, values)
        .elementByTagName('body')
        .text()
        .then(function (value) {
          console.log(value);
          return expect(value).to.contain('Awesome <5kb foo');
        })
        .nodeify(done);
  });
  
  it('removes script foo', helper.options, function (done) {
    var b = browser.get(url + '/contributions/new'),
        values = {
          title: '<script>alert("ente ente")</script>',
          name: '<script>alert("ente ente")</script>',
          description: '<script>alert("ente ente")</script>'
        };

    fillOutSubmission(b, values)
      .elementByTagName('body')
      .text()
      .then(function (value) {
        return expect(value).to.not.contain('alert');
      })
      .nodeify(done);
  });
});
