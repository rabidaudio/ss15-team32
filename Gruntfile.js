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
      src: ['src/**/*.js']
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
      dist: {
        files: {
          'quick-comments.min.js': ['quick-comments.js']
        },
        options: {
          compress: true,
        }
      }
    },

    concat: {
      options: {
        separator: '\n\n\n',
        banner: '/* <%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      dev: {
        src: ['.tmp/**/*.js', 'src/**/*.js'],
        dest: 'quick-comments.js',
      },
    },
    shell: {
      riot: {
          command: 'riot src .tmp'
      }
    },
    copy: {
      toServer: {
        src: ['quick-comments.js', 'quick-comments.min.js'],
        dest: 'public/'
      }
    }
  });

  grunt.registerTask('build', ['jshint', 'shell:riot', 'concat:dev', 'uglify:dist', 'copy:toServer']);

  grunt.registerTask('deploy', ['build', 'divshot:push:development']);

  grunt.registerTask('serve', ['build', 'connect:livereload', 'watch']);
  grunt.registerTask('default', ['serve', 'open:local']);

};