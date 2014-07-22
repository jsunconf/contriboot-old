var helper = require('./helpers/helper.js'),
    colors = require('colors'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    expect = Lab.expect,
    path = require('path');


var browser = helper.init();

describe('Start page', function () {
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
