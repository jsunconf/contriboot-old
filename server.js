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

server.pack.register([{
    plugin: require('./facets/about'),
    views: config.server.views
  },
  {
    plugin: require('./facets/submissions'),
    views: config.server.views
  },
  {
    options: config.couch,
    plugin: require('./services/data')
  }], function (err) {
  if (err) {
    throw err;
  }

  server.start(function () {
    console.log('Hapi server started @ ' + server.info.uri);
  });
});
