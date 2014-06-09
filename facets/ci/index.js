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

        if (!data || !data.rows) {
          data = {
            rows: []
          };
        }

        var submissions = data.rows.reduce(function (acc, curr, i, array) {
          if (curr.value.type === 'interest') {
            acc.interests.push(curr);
          } else {
            acc.contributions.push(curr);
          }
          return acc;
        }, {interests: [], contributions: []});

        reply.view('index', {
          siteInfo: settings.siteInfo,
          interests: submissions.interests,
          contributions: submissions.contributions
        });
      });
    }
  });

  next();
};
