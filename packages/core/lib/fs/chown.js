// Generated by CoffeeScript 2.3.2
// # `nikita.fs.chown`

// Change ownership of a file.

// ## Source Code
module.exports = {
  status: false,
  log: false,
  handler: function({options}, callback) {
    this.log({
      message: "Entering fs.chown",
      level: 'DEBUG',
      module: 'nikita/lib/fs/chown'
    });
    if (options.argument != null) {
      // Normalize options
      options.target = options.argument;
    }
    if (options.uid === false) {
      options.uid = null;
    }
    if (options.gid === false) {
      options.gid = null;
    }
    if (!options.target) {
      // Validate options
      throw Error(`Missing target: ${JSON.stringify(options.target)}`);
    }
    if (!((options.uid != null) || (options.gid != null))) {
      throw Error("Missing one of uid or gid option");
    }
    return this.system.execute({
      if: (options.uid != null) || (options.gid != null),
      cmd: `[ -n '${(options.uid != null ? options.uid : '')}' ] && chown ${options.uid} ${options.target}\n[ -n '${(options.gid != null ? options.gid : '')}' ] && chgrp ${options.gid} ${options.target}`,
      sudo: options.sudo,
      bash: options.bash,
      arch_chroot: options.arch_chroot
    }, function(err) {
      return callback(err);
    });
  }
};
