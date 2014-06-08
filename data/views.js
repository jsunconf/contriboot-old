var ddoc = {
  _id: '_design/contributions', views: {}, lists: {}, shows: {}
};

// _design/contributions/_view/byType
ddoc.views.byType = {
  map: function (doc) {
    emit(doc.type, doc);
  }
};

module.exports = ddoc;
