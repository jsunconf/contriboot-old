var CouchLogin = require('couch-login');

exports.register = function Couch (service, couchSettings, next) {
  var auth = {
        name: couchSettings.username,
        password: couchSettings.password
      },
      couch;

  couch = new CouchLogin(couchSettings.url + '/' + couchSettings.dbName, 'basic');
  couch.strictSSL = false;
  couch.login(auth, function (er, cr, data) {
    if (er) throw er;
  });

  service.method('getContributionsAndInterests', function (next) {
    couch.get('/_design/contributions/_view/byType', function (err, cr, data) {
      if (err || cr && cr.statusCode !== 200 || !data) {
        return next(err);
      }

      return next(null, data);
    });
  });

  service.method('getSubmissionById', function (id, next) {
    couch.get('/' + id, function (err, cr, data) {
      if (err || cr && cr.statusCode !== 200 || !data) {
        return next(err);
      }

      return next(null, data);
    });
  });

  service.method('saveSubmission', function (payload, next) {
    couch.post('/', payload, function (err, cr, data) {
      if (err || cr && cr.statusCode !== 201 || !data) {
        return next(err);
      }

      return next(null, data);
    });
  });

  next();
};
