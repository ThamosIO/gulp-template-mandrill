var through   = require('through2'),
  mandrillApi = require('mandrill-api'),
  gutil       = require('gulp-util'),
  PluginError = gutil.PluginError;

const PLUGIN_NAME = 'gulp-template-mandrill';

function gulpApiMandrill(opts) {
  if(!opts) {
    throw new PluginError(PLUGIN_NAME, 'Missing options for ' + PLUGIN_NAME);
  }

  return through.obj(function (file, encoding, callback) {
    if(file.isNull()) {
      return callback(null, file);
    }
    if(file.isBuffer()) {
      console.log('File:', file);
    }

    callback(null, file);
  });
}

module.exports = gulpApiMandrill;