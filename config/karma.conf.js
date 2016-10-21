const path = require('path');
const cwd = process.cwd();
const srcFiles = path.resolve(cwd, 'src/*.js');
const polyfill = path.resolve(cwd, 'node_modules/babel-polyfill/dist/polyfill.js');

module.exports = config => {
    config.set({
        browsers: ['PhantomJS'],

        reporters: ['dots'],

        frameworks: [ 'browserify', 'jasmine'],

        plugins: [
            'karma-babel-preprocessor',
            'karma-phantomjs-launcher',
            'karma-jasmine',
            'karma-browserify'
        ],

        preprocessors: {
            [srcFiles]: ['browserify']
        },

        files: [
            polyfill,
            srcFiles
        ],

        browserify: {
            debug: true,
            transform: [
                ['babelify', {presets: ['es2015']}]
            ]
        }
    });
};
