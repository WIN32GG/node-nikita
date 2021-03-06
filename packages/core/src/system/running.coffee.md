
# `nikita.system.runing`

Check if a process is running.

## Options

* `pid` (string, optional)   
  The PID of the process to inspect; required if `target` is not provided.
* `target` (string, optional)   
  Path to the file storing the PID value; required if `pid` is not provided.

## Check if the pid is running

The example check if a pid match a running process.

```javascript
require('@nikitajs/core')
.system.running({
  pid: 1034,
}, function(err, {status}){
  if(err) return;
  console.info('Is PID running: ', status ? 'yes' : 'no')
});
```

## Check if the pid stored in a file is running

The example read a file and check if the pid stored inside is currently running.
This pattern is used by YUM and APT to create lock files. The target file will
be removed if it stores a value not matching a running pid.

```javascript
require('@nikitajs/core')
.system.running({
  target: '/var/run/yum.pid'
}, function(err, {status}){
  if(err) return;
  console.info('Is PID running: ', status ? 'yes' : 'no')
});
```

## Source code

    module.exports = ({options}) ->
      @log message: "Entering system.running", level: 'DEBUG', module: 'nikita/lib/system/running'
      # Validate parameters
      throw Error 'Invalid Options: one of pid or target must be provided' unless options.pid? or options.target
      throw Error 'Invalid Options: either pid or target must be provided' if options.pid? and options.target
      @system.execute
        if: options.pid?
        cmd: """
        kill -s 0 '#{options.pid}' >/dev/null 2>&1 || exit 42
        """
        code_skipped: 42
      , (err, {code}) =>
        @log switch code
          when 0 then message: "PID #{options.pid} is running", level: 'INFO', module: 'nikita/lib/system/running'
          when 42 then message: "PID #{options.pid} is not running", level: 'INFO', module: 'nikita/lib/system/running'
      @system.execute
        if: options.target
        cmd: """
        [ -f '#{options.target}' ] || exit 43
        pid=`cat '#{options.target}'`
        echo $pid
        if ! kill -s 0 "$pid" >/dev/null 2>&1; then
          rm '#{options.target}';
          exit 42;
        fi
        """
        code_skipped: [42, 43]
        stdout_trim: true
      , (err, {code, stdout}) ->
        @log switch code
          when 0 then message: "PID #{stdout} is running", level: 'INFO', module: 'nikita/lib/system/running'
          when 42 then message: "PID #{stdout} is not running", level: 'INFO', module: 'nikita/lib/system/running'
          when 43 then message: "PID file #{options.target} does not exists", level: 'INFO', module: 'nikita/lib/system/running'
