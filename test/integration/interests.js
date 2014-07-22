var helper = require('./helpers/helper.js'),
    colors = require('colors'),
    url = helper.BASE_URL,
    Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    expect = Lab.expect,
    path = require('path');


var browser = helper.init();

describe('Interests', function () {
  it('allows to add interests', helper.options, function (done) {
    browser
      .get(url + '/interests/new')
      .elementByName('title')
      .sendKeys('roggo mag brot')
      .elementByName('name')
      .sendKeys('roggo artischoggo')
      .elementByName('description')
      .sendKeys('this is the best talk evvvvvaaaaaa')
      .elementByTagName('button')
      .click()
      .elementByTagName('body')
      .text()
      .then(function (value) {
         expect(value).to.contain('roggo artischoggo');
         expect(value).to.contain('roggo mag brot');
         return expect(value).to.contain('this is the best talk evvvvvaaaaaa');
      })
      .nodeify(done);
  });
});
