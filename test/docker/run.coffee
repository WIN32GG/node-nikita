
stream = require 'stream'
should = require 'should'
mecano = require '../../src'
test = require '../test'
they = require 'ssh2-they'

describe 'docker', ->

  scratch = test.scratch @

  they 'run a command', (ssh, next) ->
    mecano
      ssh: ssh
    .docker_run
      cmd: '/bin/echo test'
      image: 'centos:centos6'
      service: false
    , (err, executed, stdout, stderr) ->
      stdout.should.match /^test.*/ unless err
    .then next

  they 'test invalid parameter', (ssh, next) ->
    mecano
      ssh: ssh
    .docker_run
      image: 'httpd'
      name: 'mecano_test'
      service: true
      rm: true
    , (err, executed) ->
      err.message.should.match /^Invalid parameter.*/ unless err
    .docker_run
      image: 'httpd'
      service: true
      rm: false
    , (err, executed) ->
      err.message.should.match /^Invalid parameter.*/ unless err
    .then (err) -> next null

  they 'test --rm (flag option)', (ssh, next) ->
    mecano
      ssh: ssh
    .docker_run
      cmd: '/bin/echo test'
      image: 'centos:centos6'
      name: 'mecano_test_rm'
      service: false
      rm: false
    , (err, executed, stdout, stderr) ->
      stdout.should.match /^test.*/ unless err
    .execute
      cmd: """
      if command -v docker-machine >/dev/null; then docker-machine start >/dev/null && eval "$(docker-machine env dev)"; fi
      docker ps -a | grep mecano_test_rm
      """
    .execute
      cmd: """
      if command -v docker-machine >/dev/null; then docker-machine start >/dev/null && eval "$(docker-machine env dev)"; fi
      docker stop mecano_test_rm && docker rm mecano_test_rm
      """
    .then next

  they 'test unique option from array option', (ssh, next) ->
    mecano
      ssh: ssh
    .docker_run
      image: 'httpd'
      port: '499:80'
      name: 'mecano_test'
    .execute
      cmd: '/bin/bash -c "echo > /dev/tcp/127.0.0.1/499"'
    .execute
      cmd: """
      if command -v docker-machine >/dev/null; then docker-machine start >/dev/null && eval "$(docker-machine env dev)"; fi
      docker stop mecano_test && docker rm mecano_test
      """
    .then next

  they 'test array options', (ssh, next) ->
    mecano
      ssh: ssh
    .docker_run
      image: 'httpd'
      port: [ '498:80', '499:81' ]
      name: 'mecano_test'
    .execute
      cmd: '/bin/bash -c "echo > /dev/tcp/127.0.0.1/498"'
    .execute
      cmd: """
      if command -v docker-machine >/dev/null; then docker-machine start >/dev/null && eval "$(docker-machine env dev)"; fi
      docker stop mecano_test && docker rm mecano_test
      """
    .then next
