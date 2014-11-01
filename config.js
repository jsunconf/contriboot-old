var path = require('path');
var hoek = require('hoek');

var port = 8000;
if (process.env.NODE_ENV === 'test') {
  port = 8001;
}

exports.port = process.env.PORT || port;
exports.host = 'localhost';
exports.theme = 'basic-theme';

var templatePath = path.resolve(__dirname, 'templates', exports.theme);
exports.server = {
  views: {
    engines: {
      hbs: require('handlebars')
    },
    layoutPath: templatePath,
    layout: true
  }
};

exports.getViewPath = getViewPath;
function getViewPath (conf, name) {
  var confCopy = hoek.clone(conf);

  confCopy.views.path = path.resolve(templatePath, name);

  return confCopy;
}


exports.couch = {
  url: process.env.COUCH_URL || 'http://127.0.0.1:5984',
  username: process.env.COUCH_USERNAME || 'admin',
  password: process.env.COUCH_PASSWORD || 'admin',
  dbName: process.env.COUCH_DBNAME || 'contriboot_dev'
};
