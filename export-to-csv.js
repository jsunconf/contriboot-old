// streaming csv generator

const request = require('request'),
      stringify = require('csv-stringify'),
      stringifier = stringify(),
      os = require('os'),
      util = require('util'),
      Transform = require('stream').Transform,
      lstream = require('lstream');

const args = process.argv.slice(2);

const usageText = [
  'Usage:',
  'node export-to-csv.js http://mycouch.com/mydb myusername mypassword'
].join('\n');

if (!args[0] || !args[1] || !args[2]) {
  exitWithMsg(usageText);
}

const url = args[0];
const username = args[1];
const password = args[2];

if (!/^https?/.test(args[0])) {
  console.error('Error: first argument must be an url\n');
  exitWithMsg(usageText);
}

if (!/\/_design\/contributions\/_view\/byType/.test(url)) {
  console.error('Error: _design/contributions/_view/byType missing in url\n');
  exitWithMsg(usageText);
}


function Mutator () {
  Transform.call(this, {
    decodeStrings: false,
    objectMode: true
  });
}

util.inherits(Mutator, Transform);


Mutator.prototype._transform = function (chunk, encoding, done) {

  // last element has no comma
  if (/\}\}$/.test(chunk)) {
    this.push(JSON.parse(chunk).value);
    return done();
  }

  if (/^{"id"/.test(chunk)) {
    const res = JSON.parse(chunk.slice(0, -1)).value;
    this.push(res);
  }

  done();
};


request({
  uri: url,
  json: true,
  'auth': {
    'user': username,
    'pass': password,
    'sendImmediately': false
  }
}).pipe(new lstream())
  .pipe(new Mutator())
  .pipe(stringifier)
  .pipe(process.stdout);

function exitWithMsg(msg) {
  console.error(msg);
  process.exit(1);
}
