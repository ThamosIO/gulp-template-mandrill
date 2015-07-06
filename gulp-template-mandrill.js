var through   = require('through2'),
  mandrillApi = require('mandrill-api'),
  gutil       = require('gulp-util'),
  fs          = require('fs'),
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

  var mandrill = new mandrillApi.Mandrill(opts.key);

  return through.obj(function (file, encoding, callback) {
    var params = {}
      templateUnknown = false;

    if(file.isNull()) {
      return callback(null, file);
    }

    if(file.isBuffer()) {
      var tplParams = file.path.replace('html', 'json');
      // check if there's a json with the same name as the file
      try {
        params = JSON.parse(fs.readFileSync(tplParams));
      } catch (e) {
        throw new PluginError(PLUGIN_NAME, e.name + ' - ' + e.message + '\n' +
          PLUGIN_NAME + ': You should have a .json file for every .html file.');
      }

      // set html and txt from file
      params.code = file.contents.toString();
      params.text = new Buffer(
          html2txt.fromString(file.contents.toString())
        ).toString();

      // send to api via mandrill-api
      mandrill.templates.update( 
        params,
        function (result) {
          console.log('Updated template:', result.slug);
        },
        function (e) {
          // If the template doesn't exist, add it
          if(e.name === 'Unknown_Template') {
            mandrill.templates.add(
              params,
              function (result) {
                console.log('New template', result.slug);
              },
              function (e) {
                throw new PluginError(PLUGIN_NAME, 'Mandrill error occurred: ' +
                  e.name + ' - ' + e.message);
              }
            );
          } else {
            throw new PluginError(PLUGIN_NAME, 'Mandrill error occurred: ' +
              e.name + ' - ' + e.message);
          }
        }
      );
    }

    callback(null, file);
  });
}

module.exports = gulpTemplateMandrill;