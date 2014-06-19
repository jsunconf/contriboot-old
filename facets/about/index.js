var path = require('path'),
    Hoek = require('hoek');

var facetOptions = {

};

exports.register = function About (facet, options, next) {

  var settings = Hoek.applyToDefaults(options, facetOptions);

  facet.views({
    engines: { hbs: 'handlebars' },
    path: path.resolve(__dirname, 'views'),
    layoutPath: settings.views.layoutPath,
    layout: settings.views.layout
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
