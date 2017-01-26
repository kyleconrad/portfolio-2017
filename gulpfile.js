var gulp = require('gulp'),

	// Server & BrowserSync
	browserSync = require('browser-sync').create(),

	// Required for development
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	fileinclude = require('gulp-file-include'),
	rename = require('gulp-rename');

	// Required for build & deploy
	rimraf = require('rimraf'),
	es = require('event-stream'),
	cleanCSS = require('gulp-clean-css'),
	concat = require('gulp-concat'),
	uglify = require('gulp-uglify'),
	usemin = require('gulp-usemin'),
	inject = require('gulp-inject'),
	replace = require('gulp-replace'),
	imagemin = require('gulp-imagemin'),
	gzip = require('gulp-gzip'),
	rev = require('gulp-rev'),
	revReplace = require('gulp-rev-replace'),
	sitemap = require('gulp-sitemap'),
	gutil = require('gulp-util'),
	rsync = require('rsyncwrapper').rsync,
	awspublish = require('gulp-awspublish');
	


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




