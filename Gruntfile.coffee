module.exports = (grunt) ->

  "use strict"

  grunt.initConfig
    pkg: grunt.file.readJSON("package.json")

    bower:
      install:
        options:
          install: true
          cleanTargetDir: false
          cleanBowerDir: false

    copy:
      init:
        files:[
          {
            expand: true
            cwd: 'components/jquery/'
            src: 'jquery.min.js'
            dest: 'assets/scripts/libs/'
            filter: 'isFile'
          }
          {
            expand: true
            cwd: 'components/lodash/dist/'
            src: 'lodash.min.js'
            dest: 'assets/scripts/libs/'
            filter: 'isFile'
          }
          {
            expand: true
            cwd: 'components/kazitori.js/src/js/'
            src: 'kazitori.min.js'
            dest: 'assets/scripts/libs/'
            filter: 'isFile'
          }
          {
            expand: true
            cwd: 'components/requirejs/'
            src: 'require.js'
            dest: 'assets/scripts/libs/'
            filter: 'isFile'
          }
        ]

    coffee:
      product:
        options:
          bare: true
        expand: true
        cwd: 'src/coffee'
        src: ['*.coffee', '**/*.coffee']
        dest: 'assets/scripts/'
        ext: '.js'

    stylus:
      product:
        files:
          'assets/stylesheets/main.css':'src/stylus/*.styl'

    concat:
      options:
        separator: ";"
      product:
        src: ['assets/scripts/**/*.js','!assets/scripts/libs/*.js', '!assets/scripts/main.js']
        dest: 'assets/scripts/app.js'

    uglify:
      product:
        files:
          'assets/scripts/app.js': ['assets/scripts/app.js']
          'assets/scripts/main.js': ['assets/scripts/main.js']

    clean:
      product: ['assets/scripts/*', '!assets/scripts/libs']

    watch:
      coffee:
        files: ["src/coffee/*.coffee", "src/coffee/**/*.coffee"]
        tasks: ["clean:product","coffee:product", "concat:product", "uglify:product"]

      stylus:
        files: ["src/stylus/*.styl"]
        tasks: ["stylus:product"]

  grunt.loadNpmTasks "grunt-contrib-coffee"
  grunt.loadNpmTasks "grunt-contrib-stylus"
  grunt.loadNpmTasks "grunt-contrib-concat"
  grunt.loadNpmTasks "grunt-contrib-uglify"
  grunt.loadNpmTasks "grunt-contrib-watch"
  grunt.loadNpmTasks "grunt-contrib-clean"
  grunt.loadNpmTasks "grunt-bower-task"
  grunt.loadNpmTasks "grunt-contrib-copy"


  grunt.registerTask "default", ["coffee"]
  grunt.registerTask "init", ["bower:install","copy:init"]
