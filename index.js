var Hapi = require('hapi'),
    config = require('./config.js');

// Create a server with a host and port
var server = Hapi.createServer(config.host, config.port, config.server);

server.pack.require({
  './facets/about': {
    views: config.server.views,
    siteInfo: config.siteInfo
  },
}, function (err) {
  if (err) throw err;

  server.start(function () {
    console.log('Hapi server started @ ' + server.info.uri);
  });
});
