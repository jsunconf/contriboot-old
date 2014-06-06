var Hapi = require('hapi');

// Create a server with a host and port
var server = Hapi.createServer('localhost', 8000);

server.pack.require({
    './facets/about': null,
}, function (err) {
    if (err) throw err;

    server.start(function () {
        console.log('Hapi server started @ ' + server.info.uri);
    });
});
