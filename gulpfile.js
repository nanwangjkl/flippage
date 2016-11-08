var gulp = require('gulp');
var autoprefixer = require('gulp-autoprefixer')
var cleanCSS = require('gulp-clean-css');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');

gulp.task('styles', function() {
    return gulp.src('src/*.css')
    .pipe(autoprefixer({
        browsers: ['last 2 versions'],
        cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('js', function() {
    return gulp.src('src/*.js')
    .pipe(uglify())
    .pipe(rename({
        suffix: ".min"
    }))
    .pipe(gulp.dest('dist'))
});

gulp.task('default', ['styles', 'js']);
