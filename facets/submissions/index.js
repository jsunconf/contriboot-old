var Boom = require('boom'),
    Joi = require('joi'),
    qs = require('querystring');

function getVotesFromCookie (request) {
  return request.state.votes && request.state.votes.votes || [];
}

function getCreatedFromCookie (request) {
  return request.state.created && request.state.created.created || [];
}

exports.hasUserAlreadyVotedForSubmission = hasUserAlreadyVotedForSubmission;
function hasUserAlreadyVotedForSubmission (request, doc) {
  var votes = getVotesFromCookie(request);

  return votes.indexOf(doc._id) !== -1;
}


function getTweetText (domain, id, eventname, type) {
  var tweetText,
      url;

  if (type === 'interest') {
    url = domain + '/interests/' + id;
    tweetText = 'I submitted an interest for ' + eventname + ': ' + url;
  }

  if (type === 'contribution') {
    url = domain + '/contributions/' + id;
    tweetText = 'I submitted a talk for ' + eventname + ': ' + url;
  }


  tweetText = qs.escape(tweetText);

  return tweetText;
}

function getTweetTextOrNull (request, domain, id, eventname, type) {
  var created = getCreatedFromCookie(request);
  if (created.indexOf(id) !== -1) {
    return getTweetText(domain, id, eventname, type);
  }

  return null;
}

exports.register = function Submissions (facet, options, next) {

  facet.views(options.views);

  facet.state('votes', {
    ttl: 86400 * 1000 * 365,
    isHttpOnly: true,
    encoding: 'base64json',
    path: '/'
  });

  facet.state('created', {
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

        request.server.methods.getVotesbySubmissionId(doc._id, function (err, votes) {
          if (doc.responseTo) {
            request.server.methods.getSubmissionById(doc.responseTo, function (err, respondToDoc) {
              reply.view('contribution', {
                votes: votes,
                contribution: doc,
                tweetText: getTweetTextOrNull(request, options.domain, doc._id, options.eventname, 'contribution'),
                hasVoted: hasUserAlreadyVotedForSubmission(request, doc),
                respondToDoc: {
                  _id: respondToDoc._id,
                  title: respondToDoc.title
                }
              });
            });
            return;
          }

          reply.view('contribution', {
            votes: votes,
            contribution: doc,
            hasVoted: hasUserAlreadyVotedForSubmission(request, doc),
            tweetText: getTweetTextOrNull(request, options.domain, doc._id, options.eventname,  'contribution')
          });
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
        request.server.methods.getVotesbySubmissionId(doc._id, function (err, votes) {
          request.server.methods.getResponsesForInterest(doc._id, function (err, responses) {
            reply.view('interest', {
              votes: votes,
              interest: doc,
              hasVoted: hasUserAlreadyVotedForSubmission(request, doc),
              tweetText: getTweetTextOrNull(request, options.domain, doc._id, options.eventname, 'interest'),
              responses: responses
            });
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
          type: 'contributions',
          title: 'Submit a talk'
        });
      });
    }
  });

  facet.route({
    path: '/interests/new',
    method: 'GET',
    handler: function (request, reply) {
      reply.view('submit', {type: 'interests', title: 'Submit an interest for a talk'});
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
          description: Joi.string().min(10),
          twittername: Joi.string().optional().allow(''),
        }
      }
    },
    handler: function (request, reply) {
      var payload = request.payload;
      payload.type = 'interest';
      request.server.methods.saveSubmission(payload, function (err, doc) {
        var created = getCreatedFromCookie(request);
        created.push(doc.id);

        reply()
          .redirect('/interests/' + doc.id)
          .state('created', {created: created});
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
          interest: Joi.string().optional(),
          twittername: Joi.string().optional().allow(''),
        }
      }
    },
    handler: function (request, reply) {
      var payload = request.payload,
          created;
      payload.type = 'contribution';
      if (payload.interest) {
        payload.responseTo = payload.interest;
      }
      request.server.methods.saveSubmission(payload, function (err, doc) {
        created = getCreatedFromCookie(request);
        created.push(doc.id);

        reply()
          .redirect('/contributions/' + doc.id)
          .state('created', {created: created});
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

  facet.route({
    path: '/faq',
    method: 'GET',
    handler: function (request, reply) {
      reply.view('faq');
    }
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
