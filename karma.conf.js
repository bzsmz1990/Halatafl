/**
 * Created by Wenzhao on 2/23/15.
 */
module.exports = function(config){
    config.set({

        basePath : './',

        files : [
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular.js',
            'http://ajax.googleapis.com/ajax/libs/angularjs/1.3.8/angular-mocks.js',
            'ts_output_readonly_do_NOT_change_manually/src/gameLogic.js',
            'ts_output_readonly_do_NOT_change_manually/src/game.js',
            'ts_output_readonly_do_NOT_change_manually/src/aiService.js',
            'src/gameLogic_test.js',
            'src/aiService_test.js'
        ],

        reporters: ['progress', 'coverage'],

        preprocessors: {
            // source files, that you wanna generate coverage for
            // do not include tests or libraries
            // (these files will be instrumented by Istanbul)
            'ts_output_readonly_do_NOT_change_manually/src/gameLogic.js': ['coverage'],
            'ts_output_readonly_do_NOT_change_manually/src/aiService.js': ['coverage']
        },

        // optionally, configure the reporter
        coverageReporter: {
            type : 'html',
            dir : 'coverage/',
            file: 'coverage.html'
        },

        autoWatch : true,

        frameworks: ['jasmine'],

        browsers : ['Chrome'],

        plugins : [
            'karma-chrome-launcher',
            'karma-jasmine',
            'karma-coverage'
        ]

    });
};
