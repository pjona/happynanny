// Gulp dependencies
var gulp = require('gulp');

// Style dependencies
var sass = require('gulp-sass');
var cssnano = require('gulp-cssnano');
var autoprefixer = require('gulp-autoprefixer');

// JavaScript dependencies
var jshint = require('gulp-jshint');
var uglify = require('gulp-uglify');

// Images dependencies
var imagemin = require('gulp-imagemin');

// Other requires...
var useref = require('gulp-useref');
var gulpIf = require('gulp-if');
var del = require('del');
var runSequence = require('run-sequence');
var notify = require("gulp-notify");
var rev = require('gulp-rev');
var revReplace = require('gulp-rev-replace');

// Styles task
gulp.task('sass', function() {
    return gulp.src('app/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer())
        .pipe(gulp.dest('app/css'));
});

// Javascript task
var notifyJsHint = function (file) {
    if (file.jshint.success) {
        // Notify only on error
        return false;
    }

    var errors = file.jshint.results.map(function (data) {
        if (data.error) {
            return "(" + data.error.line + ':' + data.error.character + ') ' + data.error.reason;
        }
    }).join("\n");

    return file.relative + " (" + file.jshint.results.length + " errors)\n" + errors;
};

gulp.task('jshint', function() {
    return gulp.src('./app/js/*.js')
        .pipe(jshint())
        .pipe(notify(notifyJsHint));
});

// Images task
gulp.task('images', function() {
    return gulp.src('app/images/**/*.+(png|jpg|gif|svg)')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/images'))
});

// Fonts task
gulp.task('fonts', function() {
  return gulp.src('app/fonts/**/*')
  .pipe(gulp.dest('dist/fonts'))
});

gulp.task('clean:dist', function() {
    return del.sync('dist');
});

gulp.task('useref', function() {
    return gulp.src('app/*.html')
        .pipe(useref())
        // Minifies only if it's a JavaScript file
        .pipe(gulpIf('*.js', uglify()))
        // Minifies only if it's a CSS file
        .pipe(gulpIf('*.css', cssnano()))
        // Asset revisioning
        .pipe(gulpIf('*.css', rev()))
        .pipe(gulpIf('*.js', rev()))
        .pipe(revReplace())
        .pipe(gulp.dest('dist'))
});

// Extras
gulp.task('extras', function () {
    return gulp.src(['app/robots.txt', 'app/favicon.ico', 'app/order.php'])
        .pipe(gulp.dest('dist'));
});

// Builder
gulp.task('build', function (callback) {
    runSequence('clean:dist', 
        ['sass', 'useref', 'images', 'fonts', 'extras'],
        callback
    )
});

// Watcher
gulp.task('watch', function() {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    gulp.watch('app/js/*.js', ['jshint']); 
});

// Default
gulp.task('default', function (callback) {
    runSequence(['jshint', 'sass', 'watch'],
        callback
    )
});