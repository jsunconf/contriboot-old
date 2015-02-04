exports.register = function About (facet, options, next) {

  facet.views({
    engines: {
      hbs: require('handlebars'),
    },
    path: __dirname
  });

  facet.route({
    path: '/tracking/googleanalytics.js',
    method: 'GET',
    handler: function (request, reply) {
      reply.view('googleanalyticsjs', {
        googleAnalyticsUaCode: options.googleAnalyticsUaCode
      }).type('application/javascript');
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
