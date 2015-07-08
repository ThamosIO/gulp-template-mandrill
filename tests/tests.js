describe('gulp-template-mandrill', function () {
  var expect,
    should,
    plugin = require('../gulp-template-mandrill'),
    chai   = require('chai');

  before(function () {
    expect = chai.expect;
    should = chai.should;
  });

  describe('error handler', function() {
    it('should throw an error if options are missing', function () {
      expect(function () {
        plugin();
      }).to.throw(Error);
    });

    it('should throw an error if there\'s no mandrill API key', function () {
      expect(function () {
        plugin({foo:'notanapikey'});
      }).to.throw(Error);
    });
  });
});