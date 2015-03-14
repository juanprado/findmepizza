module.exports = function(grunt) {

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    assemble: {
      options: {
        layoutdir: './src/layout',
        partials: './src/partials/*.hbs'
      },
      site: {
        options: {
          layout: 'default.hbs'
        },
        files: [
          {
            expand: true,
            cwd:  './src/site/',
            src: ['**/*.hbs'],
            dest: './dest/'
          },
        ]
      }
    },

    clean: {
      dev: ['./dest'],
      tmp: ['./.tmp']
    },

    connect: {
      server: {
        options: {
          port: 8000,
          base: './dest/'
        }
      }
    },

    copy: {
      script: {
        files: [
          {
            expand: true,
            cwd: './src/assets',
            src: ['js/**/*.js', 'samples/**/*.wav'],
            dest: './dest/assets/'
          },
        ]
      },
      fonts: {
        files: [
          {
            expand: true,
            cwd:  './src/assets',
            src: ['fonts/**'],
            dest: './dest/assets/'
          },
        ]
      }
    },

    dataUri: {
      site: {
        src: ['./dest/assets/css/main.css'],
        dest: './dest/assets/css',
        options: {
          target: ['./dest/assets/img/*']
        }
      }
    },

    htmlmin: {
      dest: {
        options: {
          removeComments: true,
          collapseBooleanAttributes: true,
          removeRedundantAttributes: true,
          useShortDoctype: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          minifyJS: true,
          minifyCSS: true,
          collapseWhitespace: true
        },
        files: [{
          expand: true,
          cwd: './dest/',
          src: '**/*.html',
          dest: './dest/'
        }]
      }
    },

    imagemin: {
      optimize: {
        options: {
          optimizationLevel: 3
        },
        files: [
          {
            expand: true,
            cwd: './src/assets/img/',
            src: ['**/*'],
            dest: './dest/assets/img/'
          }
        ]
      }
    },

    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      target: ['Gruntfile.js', 'src/assets/js/**/*']
    },

    sass: {
      prod: {
        options: {
          style: 'compressed'
        },
        files: {
          './dest/assets/css/main.css': './src/assets/sass/main.scss',
        }
      },
      dev: {
        options: {
          style: 'expanded',
          quiet: true,
          lineNumbers: true
        },
        files: {
          './dest/assets/css/main.css': './src/assets/sass/main.scss',
        }
      }
    },

    uglify: {
      options: {
        preserveComments: 'some'
      }
    },

    usemin: {
      html: ['./dest/index.html']
    },

    useminPrepare: {
      site: {
        options: {
          dest: './dest/'
        },
        src: './dest/index.html'
      },
    },

    watch: {
      html: {
        files: ['./src/**/*.hbs'],
        tasks: ['assemble']
      },
      image: {
        files: ['./src/assets/img/**/*'],
        tasks: ['images']
      },
      js: {
        files: ['./src/assets/js/**/*'],
        tasks: ['script']
      },
      sass: {
        files: ['./src/assets/sass/**/*'],
        tasks: ['sass:dev']
      }
    }

  });

  grunt.loadNpmTasks('assemble');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-htmlmin');
  grunt.loadNpmTasks('grunt-contrib-imagemin');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-usemin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-data-uri');
  grunt.loadNpmTasks('grunt-newer');

  grunt.registerTask('script', ['jshint', 'copy:script']);
  grunt.registerTask('script-prod', ['useminPrepare', 'script', 'concat', 'uglify', 'usemin', 'clean:tmp']);
  grunt.registerTask('images', ['newer:imagemin', 'dataUri']);
  grunt.registerTask('build', ['clean', 'assemble', 'copy:fonts', 'sass:dev', 'script', 'images']);
  grunt.registerTask('build-prod', ['clean', 'assemble', 'copy:fonts', 'sass:prod', 'script-prod', 'images', 'htmlmin']);
  grunt.registerTask('default', ['build', 'connect', 'watch']);

};