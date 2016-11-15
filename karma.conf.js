const istanbul = require('browserify-istanbul');
const parseArgs = require('minimist');

const srcFiles = './lib/*.js';
const specFiles = './test/**/*.spec.js';
const args = parseArgs(process.argv.slice(2));

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
            type : args.cover ? 'lcov' : 'text',
            subdir: '.',
            dir: 'coverage/'
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
        },

        autoWatch: !args.cover,

        singleRun: args.cover
    });
};
