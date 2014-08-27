var path = require('path');

exports.register = function About (facet, options, next) {

  facet.views({
    engines: { hbs: require('handlebars') },
    path: path.resolve(__dirname, '..', '..', 'templates', 'about'),
    layoutPath: path.resolve(__dirname, '..', '..', 'templates'),  // TODO: create a template plugin
    layout: true
  });

  facet.route({
    path: '/imprint',
    method: 'GET',
    handler: function (request, reply) {
      reply.view('imprint', {
        title: 'Imprint'
      });
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
