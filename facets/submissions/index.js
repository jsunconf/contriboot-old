var Boom = require('boom'),
    Joi = require('joi');

function getVotesFromCookie (request) {
  return request.state.votes && request.state.votes.votes  || [];
}

exports.hasUserAlreadyVotedForSubmission = hasUserAlreadyVotedForSubmission;
function hasUserAlreadyVotedForSubmission (request, doc) {
  var votes = getVotesFromCookie(request);

  return votes.indexOf(doc._id) !== -1;
}

exports.register = function Submissions (facet, options, next) {

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
          return reply(Boom.notFound('Id not found'));
        }

        if (doc.responseTo) {
          request.server.methods.getSubmissionById(doc.responseTo, function (err, respondToDoc) {
            reply.view('contribution', {
              contribution: doc,
              hasVoted: hasUserAlreadyVotedForSubmission(request, doc),
              respondToDoc: {title: respondToDoc.title}
            });
          });
          return;
        }

        reply.view('contribution', {
          contribution: doc,
          hasVoted: hasUserAlreadyVotedForSubmission(request, doc)
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
          return reply(Boom.notFound('Id not found'));
        }

        request.server.methods.getResponsesForInterest(doc._id, function (err, responses) {
          reply.view('interest', {
            interest: doc,
            hasVoted: hasUserAlreadyVotedForSubmission(request, doc),
            responses: responses
          });
        });
      });
    }
  });

  facet.route({
    path: '/contributions/new',
    method: 'GET',
    handler: function (request, reply) {
      var interestId = request.query.respondTo;

      request.server.methods.getSubmissionById(interestId, function (err, interest) {
        reply.view('submit', {
          responseToInterest: interest,
          type: 'contributions'
        });
      });
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
        reply().redirect('/interests/' + doc.id);
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
          description: Joi.string().min(10),
          interest: Joi.string().optional()
        }
      }
    },
    handler: function (request, reply) {
      var payload = request.payload;
      payload.type = 'contribution';
      if (payload.interest) {
        payload.responseTo = payload.interest;
      }
      request.server.methods.saveSubmission(payload, function (err, doc) {
        reply().redirect('/contributions/' + doc.id);
      });
    }
  });


  facet.route({
    path: '/votes/{submissionId}',
    method: 'POST',
    handler: function (request, reply) {
      var submissionId = request.params.submissionId,
          votes,
          error;

      var payload = {
        submissionId: submissionId
      };

      votes = getVotesFromCookie(request);

      if (votes.indexOf(submissionId) !== -1) {
        error = Boom.badRequest();
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
