var path = require('path'),
    Hoek = require('hoek');

var facetOptions = {

};

exports.register = function Ci (facet, options, next) {

  var settings = Hoek.applyToDefaults(options, facetOptions);

  facet.views({
    engines: { hbs: 'handlebars' },
    path: path.resolve(__dirname, 'views'),
    layoutPath: settings.views.layoutPath,
    layout: settings.views.layout
  });

  facet.route({
    path: '/',
    method: 'GET',
    handler: function (request, reply) {
      request.server.methods.getContributionsAndInterests(function (err, data) {
        var interests = data.rows.filter(function (element) {
          return element.value.type === 'interest';
        });

        reply.view('index', {
          siteInfo: settings.siteInfo,
          interests: interests
        });
      });
    }
  });

  next();
};
