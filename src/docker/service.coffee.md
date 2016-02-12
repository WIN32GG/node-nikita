
# `docker_service(options, callback)`

Run a container in a service mode. This module is just a wrapper for docker_run
with correct options.
Indeed, in a service mode, the container must be detached and NOT removed by default
after execution. 

## Options

See `docker_run` for list of options.

## Source Code

    module.exports = (options, callback) ->
      options.detach ?= true
      options.rm ?= false
      return callback Error 'Missing container name' unless options.name? or options.container?
      @docker_run options, callback