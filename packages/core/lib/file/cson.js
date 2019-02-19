// Generated by CoffeeScript 2.3.2
// # `nikita.file.cson`

// ## Options

// * `backup` (string|boolean)   
//   Create a backup, append a provided string to the filename extension or a
//   timestamp if value is not a string, only apply if the target file exists and
//   is modified.
// * `content`   
//   Object to stringify.   
// * `target`   
//   File path where to write content to or a callback.   
// * `merge`   
//   Read the target if it exists and merge its content.   

// ## Callback parameters

// * `err`   
//   Error object if any.   
// * `written`   
//   Number of written actions with modifications.   

// ## Example

// ```js
// require('nikita')
// .file.yaml({
//   content: {
//     'my_key': 'my value'
//   },
//   target: '/tmp/my_file'
// }, function(err, {status}){
//   console.log(err ? err.message : 'Content was updated: ' + status);
// });
// ```

// ## Source Code
var misc, season;

module.exports = function({options}) {
  var ssh;
  this.log({
    message: "Entering file.yaml",
    level: 'DEBUG',
    module: 'nikita/lib/file/yaml'
  });
  // SSH connection
  ssh = this.ssh(options.ssh);
  // Options
  if (options.line_width == null) {
    options.line_width = 160;
  }
  if (options.clean == null) {
    options.clean = true;
  }
  if (options.encoding == null) {
    options.encoding = 'utf8';
  }
  if (!options.content) {
    // Validate parameters
    throw Error('Required Option: content');
  }
  if (!options.target) {
    throw Error('Required Option: target');
  }
  // Start real work
  this.call({
    if: options.merge
  }, function() {
    this.log({
      message: "Get Target Content",
      level: 'DEBUG',
      module: 'nikita/lib/file/cson'
    });
    return this.fs.readFile({
      target: options.target,
      encoding: options.encoding,
      relax: true
    }, function(err, {data}) {
      // File does not exists, this is ok, there is simply nothing to merge
      if ((err != null ? err.code : void 0) === 'ENOENT') {
        this.log({
          message: "No Target To Merged",
          level: 'DEBUG',
          module: 'nikita/lib/file/cson'
        });
        return;
      }
      if (err) {
        throw err;
      }
      try {
        data = season.parse(data);
        options.content = misc.merge(data, options.content);
        return this.log({
          message: "Target Merged",
          level: 'DEBUG',
          module: 'nikita/lib/file/cson'
        });
      } catch (error) {
        err = error;
        // Maybe change error message with sth like "Failed to parse..."
        throw err;
      }
    });
  });
  return this.call(function() {
    this.log({
      message: "Serialize Content",
      level: 'DEBUG',
      module: 'nikita/lib/file/cson'
    });
    return this.file({
      content: season.stringify(options.content),
      target: options.target,
      backup: options.backup
    });
  });
};

// ## Dependencies
misc = require('../misc');

season = require('season');

// ## Resources

// [season]: https://www.npmjs.com/package/season