var gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    less = require('gulp-less'),
    path = require('path');

gulp.task('default', function () {
  nodemon({ script: 'server.js', ext: 'html js hbs less'})
    .on('restart', function (files) {
      console.info('app restarted!');
    })
    .on('change', ['less']);
});

gulp.task('less', function () {
  gulp.src('./static/basic-theme/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./static/basic-theme/css'));
});
