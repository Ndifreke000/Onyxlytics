const { src, dest, watch, series, parallel } = require('gulp');

// Default task
exports.default = function(cb) {
    console.log('Gulp is working!');
    cb();
};

// You can add more tasks here as needed, for example:
// - Compile Sass/SCSS
// - Minify JavaScript
// - Optimize images
// - etc.
