'use strict';

var LIVERELOAD_PORT = 35729;
var SERVER_PORT     = 9000;

var fs   = require('fs');
var path = require('path');

var mountFolder = function (connect, dir) {
    return connect.static(require('path').resolve(dir));
};

module.exports = function(grunt) {

  require('load-grunt-tasks')(grunt); //load all required packages

  grunt.initConfig({

    //config files
    pkg: grunt.file.readJSON('package.json'),
    div: grunt.file.readJSON('divshot.json'),

    jshint: {
      src: ['src/**/*.js'],
      tmp: ['.tmp/*']
    },

    divshot: {
      //don't use, connect is better (has watch, etc)
      server: {options: {}},
    },
    //the real meat
    'divshot:push':{
      //options from divshot.json
      development: {},
      production: {}
    },

    watch: {
      options:{
        spawn: false,
        livereload: grunt.option('livereloadport') || LIVERELOAD_PORT
      },
      public: {
        files: ['public/**/*.*'],
        tasks: []
      },
      src: {
        files: ['src/**/*.*'],
        tasks: ['build']
      }
    },

    connect: {
      options: {
        port: grunt.option('port') || SERVER_PORT,
        hostname: '0.0.0.0'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              require('connect-livereload')({port: LIVERELOAD_PORT}),
              mountFolder(connect, 'public')
            ];
          }
        }
      }
    },

    open: {
      local: {
        path: 'http://localhost:<%= connect.options.port %>'
      },
      dev: {
        path: 'http://development.<%= div.name %>.divshot.io'
      }
    },

    uglify: {
      base: {
        files: {
          'lib/quick-comments.min.js': ['lib/quick-comments.js']
        },
        options: {
          compress: true,
        }
      },
      full: {
        files: {
          'lib/quick-comments.complete.min.js': ['lib/quick-comments.complete.js']
        },
        options: {
          compress: true,
        }
      }
    },

    concat: {
      options: {
        separator: '\n\n\n'
      },
      base: {
        src: ['.tmp/includes/**/*.js', '.tmp/tags/*.js', 'src/**/*.js'],
        dest: 'lib/quick-comments.js',
      },
      full: {
        src: ['.tmp/includes/**/*.js', '.tmp/tags/*.js', 'src/**/*.js'],
        dest: 'lib/quick-comments.complete.js'
      }
    },
    shell: {
      riot: {
          command: 'riot src .tmp/tags'
      }
    },
    copy: {
      toServer: {
        src: ['lib/*'],
        dest: 'public/'
      },
      baseDependencies: {
        src: ['bower_components/vagueTime.js/lib/vagueTime-en.js', 'bower_components/riot/dist/riot.min.js'],
        dest: '.tmp/includes/'
      },
      extraDependencies: {
        src: ['bower_components/firebase/firebase.js'],
        dest: '.tmp/includes/'
      }
    },
    clean: ['.tmp']
  });

  grunt.registerTask('build', ['jshint:src', 'compile:base', 'compile:full', 'copy:toServer']);

  grunt.registerTask('compile:base', ['copy:baseDependencies', 'shell:riot', 'concat:base', 'uglify:base', 'clean']);
  grunt.registerTask('compile:full', ['copy:baseDependencies', 'copy:extraDependencies', 'shell:riot', 'concat:full', 'uglify:full', 'clean']);

  grunt.registerTask('deploy', ['build', 'divshot:push:development']);

  grunt.registerTask('serve', ['build', 'connect:livereload', 'watch']);
  grunt.registerTask('default', ['serve', 'open:local']);

};