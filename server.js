var Hapi = require('hapi'),
    Scooter = require('scooter'),
    Blankie = require('blankie'),
    config = require('./config.js'),
    getViewPath = config.getViewPath;


if (require.main === module) {
  bootServer();
  return;
}
module.exports = bootServer;
function bootServer (cb) {
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
    Scooter,
    {
      register: Blankie,
      options: {
        fontSrc: 'self'
      }
    },
    {
      register: require('./facets/about'),
      options: getViewPath({
        domain: config.domain,
        eventname: config.eventname,
        views: config.server.views
      }, 'about')
    },
    {
      register: require('./facets/submissions'),
      options: getViewPath({
        domain: config.domain,
        eventname: config.eventname,
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
      cb && cb(server);
    });
  });
}
