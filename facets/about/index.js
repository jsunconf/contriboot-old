var path = require('path'),
    Hoek = require('hoek');

var facetOptions = {

};

exports.register = function About (facet, options, next) {

  var settings = Hoek.applyToDefaults(options, facetOptions);

  facet.views({
    engines: { hbs: require('handlebars') },
    path: path.resolve(__dirname, 'views'),
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
