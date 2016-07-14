const gulp = require('gulp'),
	babel = require('gulp-babel'),
	babelify = require('babelify'),
	browserify = require('gulp-browserify');
 
gulp.task('scripts:src', () => {
	return gulp.src(['./src/*.js', './src/layouts/*.js'])
		.pipe(babel({
			presets: ['es2015']
		}))
		.on('error', error => console.log(error.toString()))
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
		.on('error', error => console.log(error.toString()))
		.pipe(gulp.dest(file => {
			return `${file.base}/scripts`;
		}));
});

gulp.task('watch', () => {
	gulp.watch(['./src/*.js', './src/**/*.js', './examples/**/*.js'], ['scripts:src', 'scripts:examples']);
});

gulp.task('default', ['scripts:src', 'scripts:examples', 'watch']);