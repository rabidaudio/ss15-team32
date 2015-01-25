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
      tmp: ['src/.tmp/*']
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
      options: {
        compress: true,
      },
      base: {
        files: {
          'public/lib/quick-comments.min.js': ['public/lib/quick-comments.js']
        },
      },
      full: {
        files: {
          'public/lib/quick-comments.complete.min.js': ['public/lib/quick-comments.complete.js']
        },
      },
      tiny: {
        files: {
          'public/lib/quick-comments.tiny.min.js': ['public/lib/quick-comments.tiny.js']
        },
      }
    },

    concat: {
      options: {
        separator: '\n\n\n'
      },
      base: {
        src: ['src/.tmp/includes/**/*.js', 'src/.tmp/tags/*.js', 'src/**/*.js'],
        dest: 'public/lib/quick-comments.js',
      },
      full: {
        src: ['src/.tmp/includes/**/*.js', 'src/.tmp/tags/*.js', 'src/**/*.js'],
        dest: 'public/lib/quick-comments.complete.js'
      },
      tiny: {
        src: ['src/.tmp/includes/**/*.js', 'src/.tmp/tags/*.js', 'src/**/*.js'],
        dest: 'public/lib/quick-comments.tiny.js'
      },
    },
    shell: {
      riot: {
          command: 'riot src src/.tmp/tags'
      }
    },
    copy: {
      baseDependencies: {
        src: ['bower_components/vagueTime.js/lib/vagueTime-en.js', 'bower_components/riot/dist/riot.min.js'],
        dest: 'src/.tmp/includes/'
      },
      extraDependencies: {
        src: ['bower_components/firebase/firebase.js'],
        dest: 'src/.tmp/includes/'
      }
    },
    clean: ['src/.tmp'],
    requirejs: {
      compile: {
        options: {
          baseUrl: "src",
          include: "main",
          insertRequire: ['main'],
          name: "../bower_components/almond/almond",
          out: 'public/lib/quick-comments.js',
          wrap: {
              startFile: 'src/head.partial.js',
              endFile: 'src/foot.partial.js'
          },
          paths: {
            'firebase': '../bower_components/firebase/firebase'
          },
          optimize: 'none'
        }
      }
    }
  });

  grunt.registerTask('build', ['jshint:src', 'compile:tiny', 'compile:base', 'compile:full']);

  grunt.registerTask('compile', ['shell:riot', 'concat:tiny', 'uglify:tiny', 'clean']);
  grunt.registerTask('compile:base', ['copy:baseDependencies', 'shell:riot', 'concat:base', 'uglify:base', 'clean']);
  grunt.registerTask('compile:full', ['copy:baseDependencies', 'copy:extraDependencies', 'shell:riot', 'concat:full', 'uglify:full', 'clean']);

  grunt.registerTask('deploy', ['build', 'divshot:push:development']);

  grunt.registerTask('serve', ['build', 'connect:livereload', 'watch']);
  grunt.registerTask('default', ['serve', 'open:local']);

};