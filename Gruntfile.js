module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    sed: {
      relativePaths: {
        path: './build/index.html',
        pattern: '="/',
        replacement: '="./'
      }
    },
    compress: {
      main: {
        createEmptyArchive: false,
        options: {
          archive: 'DrowningAmongStars_<%= pkg.version %>.zip'
        },
        files: [{
          expand: true,
          cwd: './build/',
          src: [
            './index.html',
            './static/**'
          ],
          dest: '/'
        }]
      }
    },
    run: {
      publish: {
        cmd: 'butler',
        args: [
          'push',
          'DrowningAmongStars_<%= pkg.version %>.zip',
          'tempest-dawn/drowning-among-stars:web'
        ]
      }
    }
  })

  grunt.loadNpmTasks('grunt-sed')
  grunt.loadNpmTasks('grunt-contrib-compress')
  grunt.loadNpmTasks('grunt-run')

  grunt.registerTask('build', ['sed', 'compress'])
  grunt.registerTask('publish', ['run:publish'])
}
