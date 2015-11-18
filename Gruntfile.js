module.exports = function(grunt) {

    'use strict';

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        karma: {
            unit: {
                configFile: 'karma.conf.js',
                background: true,
                singleRun: false
            }
        },
        // Run karma and watch files using:
        // grunt karma:unit:start watch
        watch: {
            files: ['src/*.js'],
            tasks: ['jshint', 'karma:unit:run']
        },
        concat: {
            options: {
                separator: ';',
            },
            dist: {
                // Order is important! gameLogic.js must be first because it defines myApp angular module.
                src: ['src/gameLogic.js', 'src/game.js'],
                dest: 'dist/everything.js',
            },
        },
        uglify: {
            options: {
                sourceMap: true,
            },
            my_target: {
                files: {
                    'dist/everything.min.js': ['dist/everything.js']
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    'game.min.html': ['game.html']
                }
            }
        },
        manifest: {
            generate: {
                options: {
                    basePath: '.',
                    cache: [
                        'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.min.js',
                        'http://yoav-zibin.github.io/emulator/dist/turnBasedServices.3.min.js',
                        'http://yoav-zibin.github.io/emulator/main.css',
                        'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-touch.min.js',
                        'http://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.1/ui-bootstrap-tpls.min.js',
                        'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/css/bootstrap.min.css',
                        'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/fonts/glyphicons-halflings-regular.woff',
                        'http://maxcdn.bootstrapcdn.com/bootstrap/3.3.1/fonts/glyphicons-halflings-regular.ttf',
                        'dist/everything.min.js',
                        'game.css',
                        'imgs/HelpSlide1.png',
                        'imgs/HelpSlide2.png',
                        'imgs/sheep.png',
                        'imgs/fox.png',
                        'imgs/background.png',
                        'imgs/empty.png'

                    ],
                    network: [ 'languages/en.js',
                        'languages/zh.js',
                        'dist/everything.min.js.map',
                        'dist/everything.js'],
                    timestamp: true
                },
                dest: 'game.appcache',
                src: []
            }
        },
        'http-server': {
            'dev': {
                // the server root directory
                root: '.',
                port: 9000,
                host: "0.0.0.0",
                cache: 1,
                showDir : true,
                autoIndex: true,
                // server default file extension
                ext: "html",
                // run in parallel with other tasks
                runInBackground: true
            }
        },
        protractor: {
            options: {
                configFile: "protractor.conf.js", // Default config file
                keepAlive: true, // If false, the grunt process stops when the test fails.
                noColor: false, // If true, protractor will not use colors in its output.
                args: {
                    // Arguments passed to the command
                }
            },
            all: {}
        },
    });

    require('load-grunt-tasks')(grunt);

    // Default task(s).
    grunt.registerTask('default', ['karma',
        'concat', 'uglify',
        'processhtml', 'manifest',
        ]);

};
