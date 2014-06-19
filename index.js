var Hapi = require('hapi'),
    config = require('./config.js');

var server = Hapi.createServer(config.host, config.port, config.server);

server.route({
  path: '/static/{path*}',
  method: 'GET',
  handler: {
    directory: {
      path: './static',
      listing: false,
      index: false
    }
  }
});

server.pack.require({
  './facets/about': {
    views: config.server.views
  },
  './facets/submissions': {
    views: config.server.views
  },
  './services/data': config.couch
}, function (err) {
  if (err) throw err;

  server.start(function () {
    console.log('Hapi server started @ ' + server.info.uri);
  });
});
