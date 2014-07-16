var helper = require('./helpers/helper.js'),
    wd = require('wd'),
    colors = require('colors'),
    s = helper.selenium,
    Lab = require('lab'),
    describe = Lab.experiment,
    before = Lab.before,
    it = Lab.test,
    expect = Lab.expect,
    after = Lab.after,
    path = require('path');

before(function (done) {
  s.start(done);
});

after(function (done) {
  browser.quit(function () {
    s.stop(done);
  });
});

var browser;
if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
  browser = wd.promiseChainRemote("ondemand.saucelabs.com", 80, process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY);
} else {
  browser = wd.promiseChainRemote();
}

browser.on('status', function (info) {
  console.log(info.cyan);
});
browser.on('command', function (meth, path, data) {
  console.log(' > ' + meth.yellow, path.grey, data || '');
});

describe('Start page', function () {

  it('displays interests', {timeout: 100500}, function (done) {
    browser.init({'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER})
      .get(s.url + '/')
      .elementByTagName('a')
      .text()
      .then(function (value) {
         return expect(value).to.equal('JS as compilation target');
      })
      .nodeify(done);
  });
});
