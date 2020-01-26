var gulp = require('gulp');
var uglify = require('gulp-uglify');
var sass = require('gulp-sass');
var plumber = require('gulp-plumber');
var livereload = require('gulp-livereload');
var imagemin = require('gulp-imagemin');
var autoprefixer = require('gulp-autoprefixer');
var babel = require('gulp-babel')
var rename = require('gulp-rename');
var concat = require('gulp-concat');
var pug = require('gulp-pug');




// imagemin
gulp.task('image', function(){
	gulp.src('src/images/**/*')
	.pipe(imagemin())
	.pipe(gulp.dest('dist/images'))
})

// copie fonts 
gulp.task('copyFont', function(){
	gulp.src('src/fonts/*')
	    .pipe(gulp.dest('dist/fonts'));
})

// scripts task
gulp.task('scripts', function(){
	gulp.src('src/js/*.js')
	    .pipe(plumber())
	    .pipe(concat('main.js'))  
	    .pipe(babel({
		      presets: [
		        ['@babel/env', {
		          modules: false
		        }]
		      ]
			}))
		.pipe(gulp.dest('dist/js'))
	    .pipe(uglify())
	    .pipe(rename({suffix: '.min'}))
	    .pipe(gulp.dest('dist/js'))
	    .pipe(livereload());
});

// styles tasks
gulp.task('styles', function(){
	gulp.src('src/sass/**/*.scss')
	    .pipe(sass({outputStyle: 'compressed'})).on('error', sass.logError)
	    .pipe(autoprefixer('last 2 versions'))
	    .pipe(rename({suffix: '.min'}))
	    .pipe(gulp.dest('dist/css'))
	    .pipe(livereload());
});


// pug file 
gulp.task('views', function() {
    gulp.src('src/html/**/!(_)*.pug')
		.pipe(plumber())
		.pipe(pug())
		.pipe(rename({suffix: '.min'}))
		.pipe(gulp.dest('dist/html'))
		.pipe(livereload());
});


// watching tasks
gulp.task('watch', function(){

	var server = livereload();
	
	livereload.listen();

	gulp.watch('src/js/*.js', ['scripts']);
	gulp.watch('src/sass/**/*.scss', ['styles']);
	gulp.watch('src/images/*', ['image']);
	gulp.watch('src/fonts/*', ['copyFont']);
	gulp.watch('src/html/**/*.pug', ['views']);
});



gulp.task('default', ['scripts', 'styles', 'image', 'copyFont', 'views', 'watch']);