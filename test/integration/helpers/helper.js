var config = require('../../../config.js'),
    spawn = require('child_process').spawn,
    Lab = require('lab'),
    before = Lab.before,
    after = Lab.after,
    wd = require('wd');

exports.options = { timeout: 10000 };
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
    this.server = spawn('java', ['-jar', 'selenium-server-standalone-2.42.2.jar'],
        {cwd: __dirname + '/../bin'});
    this.server.stdout.on('data', function (data) {
      if (data.toString().indexOf('Started HttpContext[/wd,/wd]') !== -1) {
        cb();
      }
    });
  },
  startApp: function (cb) {
    this.app = spawn('node', ['index.js'], {cwd: __dirname + '/../../../'});
    this.app.stdout.on('data', function (data) {
      if (data.toString().indexOf('Hapi server started') !== -1) {
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


exports.init = function () {
  var browser;

  before(function (done) {
    s.start(done);
  });

  after(function (done) {
    browser.quit(function () {
      s.stop(done);
    });
  });

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

  return browser;
};
