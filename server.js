var Hapi = require('hapi'),
    config = require('./config.js'),
    getViewPath = config.getViewPath;

var server = new Hapi.Server();
server.connection({
  host: config.host,
  port: config.port
});
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

server.register([
  {
    register: require('./facets/about'),
    options: getViewPath({
      views: config.server.views
    }, 'about')
  },
  {
    register: require('./facets/submissions'),
    options: getViewPath({
      views: config.server.views
    }, 'submissions')
  },
  {
    register: require('./services/data'),
    options: config.couch
  }], function (err) {

  if (err) {
    throw err;
  }

  server.start(function () {
    console.log('Hapi server started @ ' + server.info.uri);
  });
});
