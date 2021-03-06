// Generated by CoffeeScript 2.3.2
// # `nikita.tools.gem.remove`

// Remove a Ruby gem.

// Ruby Gems package a ruby library with a common layout. Inside gems are the 
// following components:

// - Code (including tests and supporting utilities)
// - Documentation
// - gemspec

// ## Options

// * `gem_bin` (string)   
//   Path to the gem command, default to 'gem'
// * `name` (string)   
//   Name of the gem, required.   
// * `version` (string)   
//   Version of the gem, default to all versions.   

// ## Callback parameters

// * `err`   
//   Error object if any.   
// * `status`   
//   Indicate if a gem was removed.   

// ## Ruby behavior

// Ruby place global gems inside "/usr/share/gems/gems" and user gems are by 
// default installed inside "/usr/local/share/gems".

// Any attempt to remove a gem installed globally and not in the user repository 
// will result with the error "{gem} is not installed in GEM_HOME, try: gem 
// uninstall -i /usr/share/gems json"

// ## Source code
module.exports = function({options}) {
  var gems, k, ref, v, version;
  this.log({
    message: "Entering rubygem.remove",
    level: 'DEBUG',
    module: 'nikita/lib/tools/rubygem/remove'
  });
  // Global Options
  if (options.ruby == null) {
    options.ruby = {};
  }
  ref = options.ruby;
  for (k in ref) {
    v = ref[k];
    if (options[k] == null) {
      options[k] = v;
    }
  }
  if (options.gem_bin == null) {
    options.gem_bin = 'gem';
  }
  version = options.version ? `-v ${options.version}` : '-a';
  gems = null;
  return this.system.execute({
    cmd: `${options.gem_bin} list -i ${options.name} || exit 3\n${options.gem_bin} uninstall ${options.name} ${version}`,
    code_skipped: 3,
    bash: options.bash
  });
};
