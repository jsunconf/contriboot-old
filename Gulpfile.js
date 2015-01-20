var config = require('./config.js'),
    gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify'),
    changed = require('gulp-changed');

const STATIC_DESTINATION = './static-dist/';


gulp.task('default', function () {
  nodemon({ script: 'server.js', ext: 'html js hbs less'})
    .on('restart', function (files) {
      console.info('app restarted!');
    })
    .on('change', ['build-assets']);
});

gulp.task('less', function () {
  gulp.src('./static/' + config.theme + '/less/*.less')
    .pipe(less())
    .pipe(gulp.dest(STATIC_DESTINATION + '/' + config.theme + '/css'));
});

gulp.task('js', function () {
  // /static/bower_components/jquery/src/intro.js cannot be parsed and we do not need it
  gulp.src(['./static/**/*.js', '!./static/bower_components/jquery/src/*'])
    .pipe(changed(STATIC_DESTINATION))
    .pipe(uglify())
    .pipe(gulp.dest(STATIC_DESTINATION));
});

gulp.task('build-assets', ['less', 'js']);





