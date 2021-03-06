
# `nikita.ipa.group`

Add or modify a group in FreeIPA.

## Options

* `attributes` (object, required)   
  Attributes associated with the group to add or modify.
* `referer` (string, ?required)   
  The HTTP referer of the request, required unless provided inside the `Referer`
  header.
* `cn` (string, required)   
  Name of the group to add.
* `url` (string, required)    
  The IPA HTTP endpoint, for example "https://ipa.domain.com/ipa/session/json"

## Exemple

```js
require('nikita')
.ipa.group({
  cn: 'somegroup',
  referer: 'https://my.domain.com',
  url: 'https://ipa.domain.com/ipa/session/json',
  principal: 'admin@DOMAIN.COM',
  password: 'XXXXXX'
}, function(){
  console.info(err ? err.message : status ?
    'Group was updated' : 'Group was already set')
})
```

    module.exports = ({options}, callback) ->
      options.attributes ?= {}
      options.http_headers ?= {}
      options.http_headers['Accept'] ?= 'applicaton/json'
      options.http_headers['Referer'] ?= options.referer
      throw Error "Required Option: cn is required, got #{options.cn}" unless options.cn
      throw Error "Required Option: url is required, got #{options.url}" unless options.url
      throw Error "Required Option: principal is required, got #{options.principal}" unless options.principal
      throw Error "Required Option: password is required, got #{options.password}" unless options.password
      throw Error "Required Option: referer is required, got #{options.http_headers['Referer']}" unless options.http_headers['Referer']
      output = {}
      @ipa.group.exists options,
        cn: options.cn
      @call ({}, callback) ->
        @connection.http options,
          negotiate: true
          url: options.url
          method: 'POST'
          data:
            method: unless @status(-1) then "group_add/1" else "group_mod/1"
            params: [[options.cn], options.attributes]
            id: 0
          http_headers: options.http_headers
        , (error, {data}) ->
          if data?.error
            return callback null, false if data.error.code is 4202 # no modifications to be performed
            error = Error data.error.message
            error.code = data.error.code
          output.result = data.result.result
          callback error, true
      @call
        unless: -> @status -1
      , ->
        @ipa.group.show options,
          cn: options.cn
        , (err, {result}) ->
          output.result = result unless err
      @next (err, {status}) ->
        callback err, status: status, result: output.result
      
        
## Dependencies

    string = require '@nikitajs/core/lib/misc/string'
    diff = require 'object-diff'
