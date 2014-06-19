var path = require('path'),
    Hoek = require('hoek'),
    Hapi = require('hapi');

var facetOptions = {

};

exports.register = function Submissions (facet, options, next) {

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
          interests: submissions.interests,
          contributions: submissions.contributions
        });
      });
    }
  });

  facet.route({
    path: '/contributions/{id}',
    method: 'GET',
    handler: function (request, reply) {
      request.server.methods.getSubmissionById(request.params.id, function (err, doc) {

        if (!doc || !doc._id) {
          return reply(Hapi.error.notFound('Id not found'));
        }
        reply.view('contribution', {
          contribution: doc
        });
      });
    }
  });

  facet.route({
    path: '/interests/{id}',
    method: 'GET',
    handler: function (request, reply) {
      request.server.methods.getSubmissionById(request.params.id, function (err, doc) {
        if (!doc || !doc._id) {
          return reply(Hapi.error.notFound('Id not found'));
        }
        reply.view('interest', {
          interest: doc
        });
      });
    }
  });

  facet.route({
    path: '/interests/new',
    method: 'GET',
    handler: function (request, reply) {
      reply.view('submit', {});
    }
  });

  next();
};
