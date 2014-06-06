var path = require('path');

exports.register = function About (facet, options, next) {

    facet.views({
        engines: { hbs: 'handlebars' },
        path: path.resolve(__dirname, 'views'),
    });

    facet.route({
        path: "/team",
        method: "GET",
        handler: function(request, reply) {
            reply('The Team');
        }
    });

    facet.route({
        path: "/imprint",
        method: "GET",
        handler: function(request, reply) {
            reply.view('imprint', {});
        }
    });

    next();
};