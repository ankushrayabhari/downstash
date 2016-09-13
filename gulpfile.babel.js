import gulp from 'gulp';
import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';

gulp.task('js', () => {
	const stream = gulp.src('src/**/*.js')
	.pipe(babel())
	.pipe(gulp.dest('bin'));
	return stream;
});

gulp.task('compile', ['js'])

gulp.task('server', () => {
	const stream = nodemon({
		script: 'bin/server.js',
		watch: 'src',
		tasks: ['compile']
	});

    return stream;
});