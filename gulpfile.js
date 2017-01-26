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



// Clear "dist" directory
gulp.task('remove', function (cb) {
    rimraf('./dist', cb);
});


// Minify CSS and create revision file
gulp.task('minify', ['sass'], function() {
	return gulp.src('./prod/css/*.css')
		.pipe(cleanCSS({
			compatibility: '*'
		}))
		.pipe(gulp.dest('./dist/css'))
		.pipe(rev())
		.pipe(gulp.dest('./dist/css'))
		.pipe(rev.manifest('./dist/rev-manifest.json', {
			base: './dist',
			merge: true
		}))
      	.pipe(gulp.dest('./dist'));
});


// Concat and uglify JavaScript, create revision file
gulp.task('scripts', function() {
	return es.merge(
	  	gulp.src('./prod/js/*.js')
	      	.pipe(uglify())
	      	.pipe(gulp.dest('./dist/js'))
	      	.pipe(rev())
	      	.pipe(gulp.dest('./dist/js'))
	      	.pipe(rev.manifest('./dist/rev-manifest.json', {
				base: './dist',
				merge: true
			}))
	      	.pipe(gulp.dest('./dist')),
		gulp.src('./prod/js/lib/*.js')
			.pipe(concat({
				path: 'header.js',
				cwd: ''
			}))
			.pipe(uglify({
	      		mangle: false
	      	}))
	      	.pipe(gulp.dest('./dist/js'))
	      	.pipe(rev())
	      	.pipe(gulp.dest('./dist/js'))
	      	.pipe(rev.manifest('./dist/rev-manifest.json', {
				base: './dist/',
				merge: true
			}))
			.pipe(gulp.dest('./dist'))
  	);
});


// Gzip CSS and JavaScript
gulp.task('gzip', ['scripts'], function() {
	return es.merge(
		gulp.src('./dist/js/*.js')
			.pipe(gzip())
	        .pipe(gulp.dest('./dist/js')),
	    gulp.src('./dist/css/*.css')
	    	.pipe(gzip())
	    	.pipe(gulp.dest('./dist/css'))
   );
});


// Build & replace HTML files, use revision file
gulp.task('html', ['scripts'], function() {
	var manifest = gulp.src('./dist/rev-manifest.json');

	return es.merge(
		gulp.src('./prod/*.html')
			.pipe(usemin())
			.pipe(inject(gulp.src('./dist/js/header.js', {
				read: false
			}), {
				ignorePath: 'dist',
				removeTags: true,
				name: 'header'
			}))
			.pipe(replace('/css/', '//cdn.kyleconrad.com/css/'))
			.pipe(replace('/js/', '//cdn.kyleconrad.com/js/'))
			.pipe(replace('/img/', '//cdn.kyleconrad.com/img/'))
			.pipe(revReplace({ manifest: manifest }))
			.pipe(gulp.dest('./dist')),
	  	gulp.src("./prod/**/*.txt")
	  		.pipe(gulp.dest('./dist'))
	);
});


// Image minification
gulp.task('images', function() {
	return es.merge(
		gulp.src(['./prod/img/**/*', '!./prod/img/**/*.gif'])
	        .pipe(imagemin({
	        	progressive: true,
	        	svgoPlugins: [{
	        		removeViewBox: false
	        	},
	        	{
	        		cleanupIDs: false
	        	},
	        	{
	        		collapseGroups: false
	        	},
	     		{
	     			convertShapeToPath: false
	     		}]
	        }))
	        .pipe(gulp.dest('./dist/img')),
		gulp.src('./prod/img/**/*.gif')
			.pipe(gulp.dest('./dist/img')),
		gulp.src(['./prod/*.png', './prod/*.jpg'])
	        .pipe(imagemin({
	        	progressive: true
	        }))
	        .pipe(gulp.dest('./dist')),
		gulp.src('./prod/*.ico')
			.pipe(gulp.dest('./dist'))
	);
});


// Build sitemap
gulp.task('sitemap', ['html'], function () {
    gulp.src('./dist/**/*.html')
        .pipe(sitemap({
            siteUrl: 'https://kyleconrad.com'
        }))
        .pipe(gulp.dest('./dist'));
});


// Main build function
gulp.task('build', ['remove'], function(){
	return gulp.start(
		'minify',
		'gzip',
		'html',
		'images',
		'sitemap'
	);
});



// =================================================================================== //




