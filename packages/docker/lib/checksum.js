// Generated by CoffeeScript 2.3.2
// # `nikita.docker.build`

// Return the checksum of repository:tag, if it exists. Function not native to docker.

// ## Options

// * `boot2docker` (boolean)   
//   Whether to use boot2docker or not, default to false.
// * `cwd` (string)   
//   change the working directory for the build.
// * `image` (string)   
//   Name of the image, required.
// * `repository` (string)   
//   Alias of image.
// * `machine` (string)   
//   Name of the docker-machine, required if using docker-machine.
// * `tag` (string)   
//   Tag of the image, default to latest.

// ## Callback parameters

// * `err`   
//   Error object if any.
// * `status`   
//   True if command was executed.
// * `checksum`   
//   Image cheksum if it exist, undefined otherwise.

// ## Source Code
var docker;

module.exports = function({options}, callback) {
  var cmd, k, ref, v;
  this.log({
    message: "Entering Docker checksum",
    level: 'DEBUG',
    module: 'nikita/lib/docker/checksum'
  });
  // Global options
  if (options.docker == null) {
    options.docker = {};
  }
  ref = options.docker;
  for (k in ref) {
    v = ref[k];
    if (options[k] == null) {
      options[k] = v;
    }
  }
  // Validation
  if (options.image == null) {
    options.image = options.repository;
  }
  if (options.image == null) {
    return callback(Error('Missing repository parameter'));
  }
  if (options.tag == null) {
    options.tag = 'latest';
  }
  // Run `docker images` with the following options:
  // - `--no-trunc`: display full checksum
  // - `--quiet`: discard headers
  cmd = `images --no-trunc --quiet ${options.image}:${options.tag}`;
  this.log({
    message: `Getting image checksum :${options.image}`,
    level: 'INFO',
    module: 'nikita/lib/docker/checksum'
  });
  return this.system.execute({
    cmd: docker.wrap(options, cmd)
  }, function(err, {status, stdout, stderr}) {
    var checksum;
    checksum = stdout === '' ? void 0 : stdout.toString().trim();
    if (status) {
      this.log({
        message: `Image checksum for ${options.image}: ${checksum}`,
        level: 'INFO',
        module: 'nikita/lib/docker/checksum'
      });
    }
    return callback(err, {
      status: status,
      checksum: checksum
    });
  });
};

// ## Modules Dependencies
docker = require('@nikitajs/core/lib/misc/docker');
