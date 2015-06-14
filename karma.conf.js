module.exports = function(config) {
    config.set({
        basePath: '',
        frameworks: ['mocha', 'chai'],
        plugins: [
            'karma-mocha',
            'karma-chai',
            'karma-mocha-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ],
        client: {
        },
        files: [
            'node_modules/resemblejs/resemble.js',
            'canvas2svg.js',
            'test/globals.js',
            'test/example/*.js',
            'test/unit.spec.js',
            'test/example.spec.js'
        ],
        preprocessors: {
        },
        reporters: ['mocha'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_DISABLE,
        autoWatch: false,
        browsers: ['Firefox', 'Chrome'],
        singleRun: true
    });
};