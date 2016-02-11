// Generated by CoffeeScript 1.10.0
var docker;

module.exports = function(options, callback) {
  var cmd;
  if (options.repository == null) {
    return callback(Error('Missing repository parameter'));
  }
  if (options.tag == null) {
    options.tag = 'latest';
  }
  cmd = " images | grep '" + options.repository + "' | grep '" + options.tag + "' | awk ' { print $3 }'";
  options.log({
    message: "Getting repository cheksum :" + options.repository,
    level: 'INFO',
    module: 'mecano/lib/docker/checksum'
  });
  return this.execute({
    cmd: docker.wrap(options, cmd)
  }, function(err, executed, stdout, stderr) {
    var checksum;
    checksum = stdout === '' ? false : stdout.toString().trim();
    if (executed) {
      options.log({
        message: "Image checksum for " + options.repository + ": " + checksum,
        level: 'INFO',
        module: 'mecano/lib/docker/checksum'
      });
    }
    return callback(err, executed, checksum);
  });
};

docker = require('../misc/docker');