var config = require('./config.js'),
    gulp = require('gulp'),
    nodemon = require('gulp-nodemon'),
    less = require('gulp-less'),
    uglify = require('gulp-uglify');

gulp.task('default', function () {
  nodemon({ script: 'server.js', ext: 'html js hbs less'})
    .on('restart', function (files) {
      console.info('app restarted!');
    })
    .on('change', ['less']);
});

gulp.task('less', function () {
  gulp.src('./static/' + config.theme + '/less/*.less')
    .pipe(less())
    .pipe(gulp.dest('./static/' + config.theme + '/css'));
});

gulp.task('js', function () {
  // /static/bower_components/jquery/src/intro.js cannot be parsed and we do not need it
  gulp.src(['./static/**/*.js', '!./static/bower_components/jquery/src/*'])
    .pipe(uglify())
    .on('error', function(){
      console.log('####', arguments)
    })
    .pipe(gulp.dest('./static-dist/'));
});



