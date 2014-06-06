var Hapi = require('hapi');

// Create a server with a host and port
var server = Hapi.createServer('localhost', 8000);

// Add the route
server.route({
    method: 'GET',
    path: '/hello',
    handler: function (request, reply) {

        reply('hello world');
    }
});


server.pack.require({
    './facets/about': null,
}, function(err) {
    if (err) throw err;

    server.start(function() {
        console.log('Hapi server started @ ' + server.info.uri);
    });
});