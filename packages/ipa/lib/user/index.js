// Generated by CoffeeScript 2.3.2
// # `nikita.ipa.user`

// Add or modify a user in FreeIPA.

// ## Options

// * `attributes` (object, required)   
//   Attributes associated with the user to add or modify.
// * `referer` (string, ?required)   
//   The HTTP referer of the request, required unless provided inside the `Referer`
//   header.
// * `uid` (string, required)   
//   Name of the user to add, same as the username.
// * `username` (string, required)   
//   Name of the user to add, alias of `uid`.
// * `url` (string, required)    
//   The IPA HTTP endpoint, for example "https://ipa.domain.com/ipa/session/json"

// ## Exemple

// ```js
// require('nikita')
// .ipa.user({
//   uid: 'someone',
//   attributes: {
//     noprivate: true,
//     gidnumber: 1000,
//     userpassword: 'secret'
//   },
//   referer: 'https://my.domain.com',
//   url: 'https://ipa.domain.com/ipa/session/json',
//   principal: 'admin@DOMAIN.COM',
//   password: 'XXXXXX'
// }, function(){
//   console.info(err ? err.message : status ?
//     'User was updated' : 'User was already set')
// })
// ```
var diff, string;

module.exports = function({options}, callback) {
  var base, base1;
  if (options.uid == null) {
    options.uid = options.username;
  }
  if (options.http_headers == null) {
    options.http_headers = {};
  }
  if ((base = options.http_headers)['Accept'] == null) {
    base['Accept'] = 'applicaton/json';
  }
  if ((base1 = options.http_headers)['Referer'] == null) {
    base1['Referer'] = options.referer;
  }
  if (!options.uid) {
    throw Error(`Required Option: uid is required, got ${options.uid}`);
  }
  if (!options.url) {
    throw Error(`Required Option: url is required, got ${options.url}`);
  }
  if (!options.principal) {
    throw Error(`Required Option: principal is required, got ${options.principal}`);
  }
  if (!options.password) {
    throw Error(`Required Option: password is required, got ${options.password}`);
  }
  if (!options.http_headers['Referer']) {
    throw Error(`Required Option: referer is required, got ${options.http_headers['Referer']}`);
  }
  this.ipa.user.exists(options, {
    uid: options.uid
  });
  this.call(function({}, callback) {
    return this.connection.http(options, {
      negotiate: true,
      url: options.url,
      method: 'POST',
      data: {
        method: !this.status(-1) ? "user_add/1" : "user_mod/1",
        params: [[options.uid], options.attributes],
        id: 0
      },
      http_headers: options.http_headers
    }, function(error, {data}) {
      if (data != null ? data.error : void 0) {
        if (data.error.code === 4202) { // no modifications to be performed
          return callback(null, false);
        }
        error = Error(data.error.message);
        error.code = data.error.code;
      }
      return callback(error, true);
    });
  });
  return this.next(callback);
};


// ## Dependencies
string = require('@nikitajs/core/lib/misc/string');

diff = require('object-diff');
