exports.register = function About (facet, options, next) {

  facet.views(options.views);

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
