var request = require('request'),
    async = require('async-minihelper'),
    couchApp = require('couchapp'),
    credentials = 'admin:admin',
    root = 'http://' + credentials + '@127.0.0.1:5984/',
    testDbName = 'contriboot_dev',
    testData = require('./test/fixtures/contribs-interests.json');


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
