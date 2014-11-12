var Lab = require('lab'),
    describe = Lab.experiment,
    it = Lab.test,
    expect = Lab.expect;


var submissionController = require('../index.js');
describe('voting-cookie-handling', function () {

  it('detects a document-id cookie-value if present', function (done) {
    var hasVoted = submissionController.hasUserAlreadyVotedForSubmission({
      state: {
        votes: {
          votes: ['ente']
        }
      }
    }, {_id: 'ente'});

    expect(hasVoted).to.eql(true);
    done();
  });

  it('returns false if document-id not in cookie', function (done) {
    var hasVoted = submissionController.hasUserAlreadyVotedForSubmission({
      state: {
        votes: {
          votes: ['ente']
        }
      }
    }, {_id: 'entenbaer'});

    expect(hasVoted).to.eql(false);
    done();
  });

  it('returns false no cookie present', function (done) {
    var hasVoted = submissionController.hasUserAlreadyVotedForSubmission({
      state: {}
    }, {_id: 'entenbaer'});

    expect(hasVoted).to.eql(false);
    done();
  });
});
