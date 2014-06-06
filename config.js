var path = require('path');

exports.port = 8000;
exports.host = 'localhost';

exports.server = {
    views: {
        engines: {
            hbs: 'handlebars'
        },
        layoutPath: path.resolve(__dirname, 'templates'),
        layout: true
    }
};

exports.siteInfo = {
    keywords: 'wurst, kase, ente'
};
