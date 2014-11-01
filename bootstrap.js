var request = require('request'),
    async = require('async-minihelper'),
    couchApp = require('couchapp'),
    couch = require('./config.js').couch,
    root = 'http://' + couch.username + ':' + couch.password + '@' + couch.url.replace('http://', '') + '/',
    testDbName = couch.dbName,
    testDataSubmissions = require('./test/fixtures/contribs-interests.json'),
    testDataVotes = require('./test/fixtures/votes.json'),
    hoek = require('hoek'),
    testData = hoek.merge(testDataSubmissions, testDataVotes);


function createDb (cb) {
  request({
    uri: root + testDbName,
    method: 'PUT',
    json: true
  }, function (err, res, body) {
    if (err) {
      throw err;
    }

    console.log('[info] ' + 'db created');
    cb && cb();
  });
}

function populateDb (cb) {
  request({
    uri: root + testDbName + '/_bulk_docs',
    method: 'POST',
    json: true,
    body: {
      docs: testData
    }
  }, function (err, res, body) {
    if (err) {
      throw err;
    }

    console.log('[info] ' + 'db populated');
    cb && cb();
  });
}

function deleteDb (cb) {
  request({
    uri: root + testDbName,
    method: 'DELETE',
    json: true
  }, function (err, res, body) {
    if (err) {
      throw err;
    }

    console.log('[info] ' + 'db deleted');
    cb && cb();
  });
}

function createViews (cb) {
  couchApp.createApp(require('./data/views.js'), root + testDbName, function (doc) {
    doc.push();
    cb && cb();
  });
}

async([
  function (cb) {
    deleteDb(cb);
  },
  function (cb) {
    createDb(cb);
  },
  function (cb) {
    populateDb(cb);
  },
  function () {
    createViews();
  }
]);
