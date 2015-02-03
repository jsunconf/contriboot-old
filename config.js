var path = require('path');
var hoek = require('hoek');

var port = 8000;
if (process.env.NODE_ENV === 'test') {
  port = 8001;
}

var config = {
  couch: {
    protocol: 'http',
    host: '127.0.0.1:5984',
    username: 'admin',
    password: 'admin',
    dbName: 'contriboot_dev'
  },
  app: {
    port: port,
    host: 'localhost',
    theme: 'basic-theme',
    domain: 'http://example.com',
    eventname: 'Example Unconf',
    googleAnalyticsUaCode: ''
  }
};

if (process.env.NODE_ENV === 'production') {
  config = hoek.merge(config, require('./config-production.js'));
}

exports.port = config.app.port;
exports.host = config.app.host;
exports.theme = config.app.theme;
exports.domain = config.app.domain;
exports.eventname = config.app.eventname;
exports.googleAnalyticsUaCode = config.app.googleAnalyticsUaCode;
exports.couch = config.couch;

var templatePath = path.resolve(__dirname, 'templates', exports.theme);
exports.server = {
  views: {
    engines: {
      hbs: require('handlebars')
    },
    path: templatePath,
    layoutPath: templatePath,
    layout: true,
  }
};

exports.getViewPath = getViewPath;
function getViewPath (conf, name) {
  var confCopy = hoek.clone(conf);

  confCopy.views.path = path.resolve(templatePath, name);

  return confCopy;
}
