module.exports = function(grunt) {

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
    grunt.log.writeln('settingsFile: ' +  config.settingsFile);
//    grunt.log.writeln('Logdir: ' +  getString("logs:dataDir"));
//    grunt.log.writeln('settingsFile: ' +  config.development.logs('dataDir');

  });

};