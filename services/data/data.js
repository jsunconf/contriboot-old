var nano = require('nano'),
    sanitizer = require('sanitizer');


exports.sanitizeSubmissionPayLoad = sanitizeSubmissionPayLoad;
function sanitizeSubmissionPayLoad (payload) {
  Object.keys(payload).forEach(function (key) {
    payload[key] = sanitizer.sanitize(payload[key]);
  });

  if (payload.twittername) {
    payload.twittername = payload.twittername.replace(/@/ig, '');
  }

  return payload;
}

exports.register = function Couch (service, couchSettings, next) {
  function getClient () {
    var couch = nano({
      url: couchSettings.protocol + '://' + couchSettings.username + ':' +
        couchSettings.password + '@' + couchSettings.host + '/' + couchSettings.dbName
    });
    return couch;
  }

  service.method('getContributionsAndInterests', function (next) {
    var couch = getClient();

    couch.get('_design/contributions/_view/byType', function (err, data) {
      if (err || !data) {
        console.error(err);
        return next(err);
      }

      return next(null, data);
    });
  });

  service.method('getResponsesForInterest', function (id, next) {
    var couch = getClient();

    var url = '_design/contributions/_view/getResponsesForInterest';
    couch.get(url + '?key="' + id + '"', function (err, data) {
      if (err || !data) {
        console.error(err);
        return next(err);
      }

      next(null, data.rows);
    });
  });

  service.method('getSubmissionById', function (id, next) {
    var couch = getClient();
    couch.get('' + id, function (err, data) {
      if (err || !data) {
        console.error(err);
        return next(err);
      }

      return next(null, data);
    });
  });

  service.method('getVotesbySubmissionId', function (id, next) {
    var couch = getClient();

    var url = '_design/contributions/_view/voteCountBySubmission';
    couch.get(url + '?group=true&key="' + id + '"', function (err, votesData) {
      if (err || !votesData) {
        console.error(err);
        return next(err);
      }
      var voteObject = votesData.rows[0];
      var votes = voteObject && voteObject.value || 0;


      return next(null, votes);
    });
  });

  service.method('saveSubmission', function (payload, next) {
    payload = sanitizeSubmissionPayLoad(payload);

    var couch = getClient();
    couch.insert(payload, function (err, data) {
      if (err || !data) {
        console.error(err);
        return next(err);
      }

      return next(null, data);
    });
  });

  service.method('saveVote', function (payload, next) {
    payload.type = 'vote';

    var couch = getClient();
    couch.insert(payload, function (err, data) {

      if (err || !data) {
        console.error(err);
        return next(err);
      }

      return next(null, data);
    });
  });

  next();
};

exports.register.attributes = {
  pkg: require('./package.json')
};
