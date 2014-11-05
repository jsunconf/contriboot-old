var Hapi = require('hapi'),
    Joi = require('joi');

exports.register = function Submissions (facet, options, next) {

  function getVotesFromCookie (request) {
    return request.state.votes && request.state.votes.votes  || [];
  }

  facet.views(options.views);

  facet.state('votes', {
    ttl: 86400 * 1000 * 365,
    isHttpOnly: true,
    encoding: 'base64json',
    path: '/'
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

        reply
          .view('index', {
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
        var votes = getVotesFromCookie(request),
            hasVoted = false;

        if (!doc || !doc._id) {
          return reply(Hapi.error.notFound('Id not found'));
        }

        if (votes.indexOf(doc._id) !== -1) {
          hasVoted = true;
        }

        reply.view('interest', {
          interest: doc,
          hasVoted: hasVoted
        });
      });
    }
  });

  facet.route({
    path: '/contributions/new',
    method: 'GET',
    handler: function (request, reply) {
      reply.view('submit', {type: 'contributions'});
    }
  });

  facet.route({
    path: '/interests/new',
    method: 'GET',
    handler: function (request, reply) {
      reply.view('submit', {type: 'interests'});
    }
  });

  facet.route({
    path: '/interests/',
    method: 'POST',
    config: {
      validate: {
        payload: {
          title: Joi.string().min(3),
          name: Joi.string().min(1),
          description: Joi.string().min(10)
        }
      }
    },
    handler: function (request, reply) {
      var payload = request.payload;
      payload.type = 'interest';
      request.server.methods.saveSubmission(payload, function (err, doc) {
        reply().redirect('interests/' + doc.id);
      });
    }
  });

  facet.route({
    path: '/contributions/',
    method: 'POST',
    config: {
      validate: {
        payload: {
          title: Joi.string().min(3),
          name: Joi.string().min(1),
          description: Joi.string().min(10)
        }
      }
    },
    handler: function (request, reply) {
      var payload = request.payload;
      payload.type = 'contribution';
      request.server.methods.saveSubmission(payload, function (err, doc) {
        reply().redirect('contributions/' + doc.id);
      });
    }
  });


  facet.route({
    path: '/votes/{submissionId}',
    method: 'POST',
    config: {

    },
    handler: function (request, reply) {
      var submissionId = request.params.submissionId,
          votes,
          error;

      var payload = {
        submissionId: submissionId
      };

      votes = getVotesFromCookie(request);

      if (votes.indexOf(submissionId) !== -1) {
        error = Hapi.error.badRequest();
        reply(error);
        return;
      }

      request.server.methods.saveVote(payload, function (err, doc) {
        votes.push(submissionId);
        reply({ok: true})
          .state('votes', {votes: votes});
      });
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
