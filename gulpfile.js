var gulp          = require('gulp'),
  gulpApiMandrill = require('./gulp-template-mandrill.js');


var paths = ['data/*.html'];


gulp.task('publish', function(){
  return gulp.src(paths)
    .pipe(gulpTemplateMandrill({}));
});


gulp.task('default', ['publish']);