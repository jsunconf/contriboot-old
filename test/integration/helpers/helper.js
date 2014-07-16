var config = require('../../../config.js'),
    spawn = require('child_process').spawn;

exports.selenium = {
  url: 'http://' + config.host + ':' + config.port,
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
