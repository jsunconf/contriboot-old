module.exports = function (browser, values) {
  if (!values) {
    values = {};
  }

  return browser.elementByName('title')
    .sendKeys(values.title || 'Ente Ente')
    .elementByName('name')
    .sendKeys(values.name || 'Roebin')
    .elementByName('description')
    .sendKeys(values.description || 'ES6 Features')
    .elementByTagName('button')
    .click();
};
