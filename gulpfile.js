var gulp = require('gulp'),
  mocha = require('gulp-mocha');

gulp.task('unit', function() {
  return gulp.src('tests/tests.js')
    .pipe(mocha({reporter: 'spec'}));
});

gulp.task('test', ['unit']);
gulp.task('default', ['test']);