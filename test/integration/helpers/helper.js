  var config = require('../../../config.js'),
    spawn = require('child_process').spawn,
    wd = require('wd');

require('colors');


exports.options = { timeout: 60000 };
exports.BASE_URL = 'http://' + config.host + ':' + config.port;

var s = {
  createBrowser: '',
  server: null,
  app: null,
  start: function (cb) {
    var self = this;
    self.bootstrap(function () {
      self.startSeleniumServer(function () {
        self.startApp(cb);
      });
    });
  },
  stop: function (cb) {
    this.app.on('exit', function () {
      cb();
    });
    this.app.kill('SIGHUP');
    this.server.kill();
  },
  startSeleniumServer: function (cb) {
    this.server = spawn('java', ['-jar', 'selenium-server-standalone-2.43.1.jar'],
        {cwd: __dirname + '/../bin'});
    // https://code.google.com/p/selenium/issues/detail?id=7957
    this.server.stderr.on('data', function (data) {
      if (data.toString().indexOf('Started HttpContext[/wd,/wd]') !== -1) {
        cb();
      }
    });
  },
  startApp: function (cb) {
    this.app = spawn('node', ['server.js'], {
        cwd: __dirname + '/../../../'
      }
    );
    this.app.stdout.on('data', function (data) {
      if (data.toString().indexOf('Hapi server started') !== -1) {
        console.log(data.toString());
        cb();
      }
    });
  },
  bootstrap: function (cb) {
    var bootstrap = spawn('npm', ['run', 'bootstrap'], {cwd: __dirname + '/../../../'});
    bootstrap.on('close', function () {
      cb();
    });
  }
};

var init = exports.init = function () {
  var browser;

  if (process.env.SAUCE_USERNAME && process.env.SAUCE_ACCESS_KEY) {
    browser = wd.promiseChainRemote("ondemand.saucelabs.com", 80, process.env.SAUCE_USERNAME, process.env.SAUCE_ACCESS_KEY);
  } else {
    browser = wd.promiseChainRemote();
  }

  browser.on('status', function (info) {
    console.log(info.cyan);
  });
  browser.on('command', function (meth, path, data) {
    console.log(' > ' + meth.yellow, path.grey, data || '');
  });

  return browser.init({'tunnel-identifier': process.env.TRAVIS_JOB_NUMBER});
};

exports.testHelper = function (before, after, cb) {
  var browser;
  before(function (done) {
    s.start(function () {
      browser = init();
      cb(browser, done);
    });
  });
  after(function (done) {
    browser.quit(function () {
      s.stop(done);
    });
  });
};
