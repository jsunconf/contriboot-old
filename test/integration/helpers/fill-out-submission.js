module.exports = function (browser) {
  return browser.elementByName('title')
    .sendKeys('Ente Ente')
    .elementByName('name')
    .sendKeys('Roebin')
    .elementByName('description')
    .sendKeys('ES6 Features')
    .elementByTagName('button')
    .click();
};
