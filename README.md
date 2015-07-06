# gulp-template-mandrill

`gulp-template-mandrill` allows to upload new templates to your Mandrill account via the Mandrill API.

## Usage

To use `gulp-template-mandrill`, do :

```javascript
gulp.task('mailTemplates', function(){
  return gulp.src(pathToTemplates)
    .pipe(gulpTemplateMandrill({key: 'insert mandrill api key here'}));
});
```

You need to have `.json` file that contains the Mandrill information for your template, with the same name as the `html` file it refers to.

`gulp-template-mandrill` will fetch the `.json` files itself. 

## TODO

- Add wordwrap to html2txt
