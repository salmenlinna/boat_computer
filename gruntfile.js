module.exports = function(grunt) {
var fs = require('fs');
var touch = require("touch");
var pth = require("path");
var mkdirp = require("mkdirp");

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      // define the files to lint
      files: ['gruntfile.js', 'example_config.js', 'apps/**/app.js', 'data_sources/**/*.js', 'modules/**/*.js'],
      // configure JSHint (documented at http://www.jshint.com/docs/)
      options: {
        // more options here if you want to override JSHint defaults
        globals: {
          jQuery: true,
          console: true,
          module: true
        },
        loopfunc: true
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },
    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint', 'mochaTest']
    },
    configureBoatComputer: {
      tasks: ['configureBoatComputer']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-mocha-test');

  // Default task(s).
  grunt.registerTask('default', ['jshint','mochaTest']);

  // Installs directories and files for race data
  grunt.registerTask('configureBoatComputer', 'Creates necessary directories', function(arg1) {
    if (arguments.length === 0) {
      grunt.log.writeln(this.name + ": Specify config file as argument");
      return 1;
    } 
    config = grunt.file.readJSON(arg1);

    // dig the values form the config files
    var settingsFile = config.settingsFile;
    var winstonLogs = config['winston:logDir'];
    var logsData = config['logs:dataDir'];
    var devData = config.development.dataSources[0].file;
    var devLogData = config.development['logs:dataDir'];
 
    // create the files and directories
    createDirFile (settingsFile);
    createDir (winstonLogs);
    createDir (logsData);
    createDirFile (devData);
    createDir (devLogData);

    function createDirFile (full_path){
      file = pth.basename(full_path);
      path = pth.dirname(full_path);

      if (!path) {return 1}; // something went wrong
      var message = "";
      if (!fs.existsSync(path)){
         mkdirp.sync(path);
         message += path;
      }
      if (file && !fs.existsSync(full_path)) {
        touch.sync(full_path);
        message += file;
      } 
      if (message != ""){
        grunt.log.writeln("Creating " + path + '/' + file);
      } else {
        grunt.log.writeln(path + " already exists");
      } 
    }

   function createDir (path){
      if (!path) {return 1}; // something went wrong

      if (!fs.existsSync(path)){
        mkdirp.sync(path);
        grunt.log.writeln("Creating " + path);
      } else {
        grunt.log.writeln(path + " already exists");
      } 
    }

  });

};