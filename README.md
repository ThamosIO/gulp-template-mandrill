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

Such as :

```
templates:
  \- foo.html
  \- foo.json
```

Where foo.json contains **at least a name attribute** for the template:

```json
{
  "name": "Example Template",
  "from_email": "from_email@example.com",
  "from_name": "Example Name",
  "subject": "example subject",
  "code": "<div>example code</div>",
  "text": "Example text content",
  "publish": false,
  "labels": [
    "example-label"
  ]
}
```

See [Mandrill API docs](https://mandrillapp.com/api/docs/templates.nodejs.html) for reference.

## TODO

- Add wordwrap to html2txt
