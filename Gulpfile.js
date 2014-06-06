var gulp = require('gulp'),
    nodemon = require('gulp-nodemon');

gulp.task('default', function () {
  nodemon({ script: 'index.js', ext: 'html js hbs css sass'})
  .on('restart', function () {
    console.info('app restarted!');
  });
});
