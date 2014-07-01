var path = require('path');

exports.port = 8000;
exports.host = 'localhost';

exports.server = {
  views: {
    engines: {
      hbs: require('handlebars')
    },
    layoutPath: path.resolve(__dirname, 'templates'),
    layout: true
  }
};

exports.couch = {
  url: process.env.COUCH_URL || 'http://127.0.0.1:5984',
  username: process.env.COUCH_USERNAME || 'admin',
  password: process.env.COUCH_PASSWORD || 'admin',
  dbName: process.env.COUCH_DBNAME || 'contriboot_dev'
};
