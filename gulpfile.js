const gulp = require('gulp');
const gulpIf = require('gulp-if');
const eslint = require('gulp-eslint');
const babel = require('gulp-babel');
const babelify = require('babelify');
const browserify = require('gulp-browserify');

const config = require('./config/build.config.js');
const isCi = process.argv.includes('--ci');

gulp.task('scripts:src', () => {
    return gulp.src(config.path.src)
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', (e) => {
            console.log('>>> ERROR', e);
            this.emit('end');
        })
        .pipe(gulp.dest(file => {
            return file.base.replace('src', 'dist');
        }));
});

gulp.task('scripts:examples', () => {
    return gulp.src(['./examples/example1/*.js'])
        .pipe(browserify())
        .on('error', console.log.bind(console))
        .pipe(babel({
            presets: ['es2015']
        }))
        .on('error', (e) => {
            console.log('>>> ERROR', e);
            this.emit('end');
        })
        .pipe(gulp.dest(file => {
            return `${file.base}/scripts`;
        }));
});

gulp.task('lint', () => {
    gulp.src(config.path.src)
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(gulpIf(isCi, eslint.failAfterError()));
});

gulp.task('watch', () => {
    gulp.watch([config.path.src, './examples/**/*.js'], ['scripts:src', 'scripts:examples', 'lint']);
});

gulp.task('default', ['scripts:src', 'scripts:examples', 'lint', 'watch']);
