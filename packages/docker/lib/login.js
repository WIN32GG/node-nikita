// Generated by CoffeeScript 2.3.2
// # `nikita.docker.login`

// Register or log in to a Docker registry server.

// ## Options

// * `boot2docker` (boolean)   
//   Whether to use boot2docker or not, default to false.   
// * `registry` (string)   
//   Address of the registry server. "https://index.docker.io/v1/" by default   
// * `machine` (string)   
//   Name of the docker-machine, require if using docker-machine   
// * `email` (string)   
//   Email   
// * `user` (string)   
//   Username   
// * `password` (string)   
//   Remove intermediate containers after build. Default to false   
// * `cwd` (string)   
//   change the working directory for the build.   

// ## Callback parameters

// * `err`   
//   Error object if any.   
// * `status`   
//   True when the command was executed successfully.   
// * `stdout`   
//   Stdout value(s) unless `stdout` option is provided.   
// * `stderr`   
//   Stderr value(s) unless `stderr` option is provided.   

// ## Source Code
var docker, path, util;

module.exports = function({options}, callback) {
  var cmd, i, k, len, opt, ref, ref1, v;
  this.log({
    message: "Entering Docker login",
    level: 'DEBUG',
    module: 'nikita/lib/docker/login'
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
  if (options.image == null) {
    // Validate parameters and madatory conditions
    return callback(Error('Missing image parameter'));
  }
  if ((options.content != null) && (options.dockerfile != null)) {
    return callback(Error('Can not build from Dockerfile and content'));
  }
  cmd = 'login';
  ref1 = ['email', 'user', 'password'];
  for (i = 0, len = ref1.length; i < len; i++) {
    opt = ref1[i];
    if (options[opt] != null) {
      cmd += ` -${opt.charAt(0)} ${options[opt]}`;
    }
  }
  if (options.registry != null) {
    cmd += ` "${options.registry}"`;
  }
  return this.system.execute({
    cmd: docker.wrap(options, cmd)
  }, docker.callback);
};

// ## Modules Dependencies
docker = require('@nikitajs/core/lib/misc/docker');

path = require('path');

util = require('util');
