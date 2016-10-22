const istanbul = require('browserify-istanbul');

const srcFiles = './src/*.js';
const specFiles = './src/**/*.spec.js';

module.exports = config => {
    config.set({
        browsers: ['PhantomJS'],

        reporters: ['dots', 'coverage'],

        frameworks: [ 'browserify', 'jasmine'],

        plugins: [
            'karma-coverage',
            'karma-babel-preprocessor',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-browserify'
        ],

        preprocessors: {
            [srcFiles]: ['browserify'],
            [specFiles]: ['browserify']
        },

        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            srcFiles,
            specFiles
        ],


        babelPreprocessor: {
              options: {
                presets: ['es2015']
            }
        },

        coverageReporter: {
            type : 'text'
        },
        
        logLevel: config.LOG_DISABLE,

        browserify: {
            debug: true,
            transform: [
                ['babelify', {presets: ['es2015']}],
                istanbul({
                    ignore: ['**/node_modules/**', '**/index.js', '**/*.spec.js']
                })
            ]
        }
    });
};
