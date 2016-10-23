const gulp = require('gulp');
const gulpIf = require('gulp-if');
const eslint = require('gulp-eslint');
const browserify = require('gulp-browserify');

const config = require('./config.js');
const isCi = process.argv.includes('--ci');

gulp.task('scripts', () => {
    return gulp.src(config.path.entry)
        .pipe(browserify({
            transform: ['babelify']
        }))
        .on('error', (e) => {
            console.log('>>> ERROR', e);
        })
        .pipe(gulp.dest('dist'));
});

gulp.task('lint', () => {
    gulp.src(config.path.all)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gulpIf(isCi, eslint.failAfterError()));
});

gulp.task('watch', () => {
    gulp.watch([config.path.all], ['scripts', 'lint']);
});

gulp.task('default', ['scripts', 'lint', 'watch']);
