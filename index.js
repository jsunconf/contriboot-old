var Hapi = require('hapi'),
    config = require('./config.js');

var server = Hapi.createServer(config.host, config.port, config.server);

server.pack.require({
  './facets/about': {
    views: config.server.views,
    siteInfo: config.siteInfo
  },
  './facets/ci': {
    views: config.server.views,
    siteInfo: config.siteInfo
  },
  './services/data': config.couch
}, function (err) {
  if (err) throw err;

  server.start(function () {
    console.log('Hapi server started @ ' + server.info.uri);
  });
});
