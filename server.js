var Hapi = require('hapi'),
    config = require('./config.js'),
    getViewPath = config.getViewPath;

var server = Hapi.createServer(config.host, config.port);
server.views(config.server.views);

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
    options: getViewPath({
      views: config.server.views
    }, 'about')
  },
  {
    plugin: require('./facets/submissions'),
    options: getViewPath({
      views: config.server.views
    }, 'submissions')
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
