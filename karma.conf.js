'use strict';

const isparta = require('isparta');
const istanbul = require('browserify-istanbul');
const parseArgs = require('minimist');

const srcFiles = './lib/*.js';
const specFiles = './test/**/*.spec.js';
const args = parseArgs(process.argv.slice(2));

module.exports = config => {
    config.set({
        browsers: ['PhantomJS'],

        reporters: ['dots', 'coverage'],

        frameworks: ['browserify', 'jasmine'],

        preprocessors: {
            [srcFiles]: ['browserify'],
            [specFiles]: ['browserify']
        },

        files: [
            'node_modules/babel-polyfill/dist/polyfill.js',
            srcFiles,
            specFiles
        ],

        coverageReporter: {
            reporters: [
                { type: 'text', subdir: '.' },
                { type: 'lcov', subdir: '.' }
            ],
            dir: 'coverage/'
        },

        logLevel: config.LOG_DISABLE,

        browserify: {
            debug: true,
            transform: [
                istanbul({
                    instrumenter: isparta,
                    ignore: ['**/node_modules/**', '**/*.spec.js']
                }),
                ['babelify', {presets: ['es2015']}]
            ]
        },

        autoWatch: !args.cover,

        singleRun: args.cover
    });
};
