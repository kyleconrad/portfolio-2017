var gulp = require('gulp'),

	// Server & BrowserSync
	browserSync = require('browser-sync').create(),

	// Required for development
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	fileinclude = require('gulp-file-include'),
	rename = require('gulp-rename');

	// Required for build & deploy



// =================================================================================== //



// Server initiation, BrowserSync, and watch tasks (opens site in browser)
gulp.task('default', ['html', 'sass'], function() {
    browserSync.init(null, {
		server: {
			baseDir: './prod'
		},
		host: 'localhost'
    });

	gulp.watch('./prod/**/*.html', ['html-watch']);
    gulp.watch('./prod/sass/**/*.scss', ['sass']);
    gulp.watch('./prod/img/**/*').on('change', browserSync.reload);
    gulp.watch('./prod/js/**/*.js').on('change', browserSync.reload);
});


// Compile all HTML from templates and includes
gulp.task('html', function() {
	return gulp.src('./prod/templates/index.tpl.html')
		.pipe(fileinclude({
			prefix: '@@',
			basepath: './prod/templates/'
		}))
		.pipe(rename({
 			extname: ''
		 }))
 		.pipe(rename({
 			extname: '.html'
 		}))
		.pipe(gulp.dest('./prod'));
});


// Ensure HTML is compiled before reloading browsers
gulp.task('html-watch', ['html'], function (done) {
	browserSync.reload();
	done();
});


// Run SASS compiling and reloading
gulp.task('sass', function() {
    return gulp.src('./prod/sass/*.scss')
	    .pipe(sourcemaps.init())
        .pipe(sass({
        	errLogToConsole: true
        }))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./prod/css'))
        .pipe(browserSync.stream());
});



// =================================================================================== //




