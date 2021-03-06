
nikita = require '@nikitajs/core'
{tags, ssh, scratch, docker} = require './test'
they = require('ssh2-they').configure ssh...

return unless tags.docker

describe 'docker.run', ->

  they 'simple command', ({ssh}) ->
    nikita
      ssh: ssh
      docker: docker
    .docker.run
      cmd: "/bin/echo 'test'"
      image: 'alpine'
    , (err, {status, stdout}) ->
      status.should.be.true()
      stdout.should.match /^test.*/ unless err
    .promise()
  
  they '--rm (flag option)', ({ssh}) ->
    nikita
      ssh: ssh
      docker: docker
    .docker.rm
      force: true
      container: 'nikita_test_rm'
    .docker.run
      cmd: "/bin/echo 'test'"
      image: 'alpine'
      name: 'nikita_test_rm'
      rm: false
    , (err, {stdout}) ->
      stdout.should.match /^test.*/ unless err
    .docker.rm
      force: true
      container: 'nikita_test_rm'
    .promise()

  they 'unique option from array option', ({ssh}) ->
    @timeout 0
    nikita
      ssh: ssh
      docker: docker
    .docker.rm
      container: 'nikita_test_unique'
      force: true
    .docker.run
      image: 'httpd'
      port: '499:80'
      name: 'nikita_test_unique'
      detach: true
      rm: false
    .docker.rm
      force: true
      container: 'nikita_test_unique'
    .promise()

  they 'array options', ({ssh}) ->
    nikita
      ssh: ssh
      docker: docker
    .docker.rm
      force: true
      container: 'nikita_test_array'
    .docker.run
      image: 'httpd'
      port: [ '500:80', '501:81' ]
      name: 'nikita_test_array'
      detach: true
      rm: false
    # .wait_connect
    #   host: ipadress of docker, docker-machine...
    #   port: 500
    .docker.rm
      force: true
      container: 'nikita_test_array'
    .promise()

  they 'existing container', ({ssh}) ->
    nikita
      ssh: ssh
      docker: docker
    .docker.rm
      force: true
      container: 'nikita_test'
    .docker.run
      cmd: 'echo test'
      image: 'alpine'
      name: 'nikita_test'
      rm: false
    .docker.run
      cmd: "echo test"
      image: 'alpine'
      name: 'nikita_test'
      rm: false
    , (err, {status}) ->
      status.should.be.false() unless err
    .docker.rm
      force: true
      container: 'nikita_test'
    .promise()

  they 'status not modified', ({ssh}) ->
    nikita
      ssh: ssh
      docker: docker
    .docker.rm
      force: true
      container: 'nikita_test'
    .docker.run
      cmd: 'echo test'
      image: 'alpine'
      name: 'nikita_test'
      rm: false
    .docker.run
      cmd: 'echo test'
      image: 'alpine'
      name: 'nikita_test'
      rm: false
    , (err, {status}) ->
      status.should.be.false() unless err
    .docker.rm
      force: true
      container: 'nikita_test'
    .promise()
