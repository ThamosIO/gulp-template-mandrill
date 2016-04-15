var through   = require('through2'),
  mandrillApi = require('mandrill-api'),
  gutil       = require('gulp-util'),
  fs          = require('fs'),
  path        = require('path'),
  html2txt    = require('html-to-text');
  PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-template-mandrill';

function gulpTemplateMandrill(opts) {
  if(!opts) {
    throw new PluginError(PLUGIN_NAME, 'Missing options for ' + PLUGIN_NAME);
  }
  if(!opts.key) {
    throw new PluginError(PLUGIN_NAME, 'Missing mandrill api key for ' +
      PLUGIN_NAME);
  }

  // If no path for JSON is set, use the same as the html files
  var mandrill = new mandrillApi.Mandrill(opts.key);

  return through.obj(function (file, encoding, callback) {
    var params = {},
      templateUnknown = false;

    if(file.isNull()) {
      return callback(null, file);
    }

    if(file.isBuffer()) {
      try {
        var fpath = file.path.replace('html', 'json');
        var JSONpath = opts.JSONpath ?
          path.join(opts.JSONpath, path.basename(fpath)) : fpath;
        params = JSON.parse(fs.readFileSync(JSONpath));
      } catch (e) {
        throw new PluginError(PLUGIN_NAME, e.name + ' - ' + e.message + '\n' +
          PLUGIN_NAME + ': You should have a .json file for every .html file.');
      }

      try {
        var fpath = file.path.replace('html', 'txt');
        var txtPath = opts.JSONpath ?
          path.join(opts.JSONpath, path.basename(fpath)) : fpath;
        params.text = fs.readFileSync(txtPath).toString();
      } catch (e) {

      }

      // set html and txt from file
      params.code = file.contents.toString();

      if(!params.text){
        params.text = new Buffer(
            html2txt.fromString(file.contents.toString())
          ).toString();
      }

      // send to api via mandrill-api
      mandrill.templates.update(
        params,
        function (result) {
          gutil.log('Updated template:', result.slug);
          callback(null, file);
        },
        function (e) {
          // If the template doesn't exist, add it
          if(e.name === 'Unknown_Template') {
            mandrill.templates.add(
              params,
              function (result) {
                gutil.log('New template:', result.slug);
                callback(null, file);
              },
              function (e) {
                throw new PluginError(PLUGIN_NAME, 'Mandrill error occurred: ' + e.name + ' - ' + e.message);
              }
            );
          } else {
            throw new PluginError(PLUGIN_NAME, 'Mandrill error occurred: ' + e.name + ' - ' + e.message);
          }
        }
      );
    }
  });
}

module.exports = gulpTemplateMandrill;
