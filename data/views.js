var ddoc = {
  _id: '_design/contributions', views: {}, lists: {}, shows: {}
};

// _design/contributions/_view/byType
ddoc.views.byType = {
  map: function (doc) {
    if (doc.type === 'vote') {
      return;
    }

    emit(doc.type, doc);
  }
};

// _design/contributions/_view/voteCountBySubmission
ddoc.views.voteCountBySubmission = {
  map: function (doc) {
    if (doc.type !== 'vote') {
      return;
    }

    emit(doc.submissionId, 1);
  },
  reduce: "_sum"
};

// _design/contributions/_view/getResponsesForInterest
ddoc.views.getResponsesForInterest = {
  map: function (doc) {
    if (doc.type !== 'contribution') {
      return;
    }
    if (!doc.responseTo) {
      return;
    }

    emit(doc.responseTo, doc);
  }
};

module.exports = ddoc;
