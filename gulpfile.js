var gulp = require('gulp'),
    browserify = require("browserify"),
    source = require('vinyl-source-stream'),
    babelify = require("babelify"),
    webserver = require('gulp-webserver'),
    sass = require('gulp-sass');

var source_paths = {
  sass: './source/sass/**/*.scss',
  js: './source/js/app.js',
  all_js: './source/js/**/*.js',
  html: './source/html/**/*.html',
}

gulp.task('sass', function() {
  gulp.src(source_paths.sass)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest('./build/css'));
})

gulp.task('copy', function() {
  gulp.src(source_paths.html)
    .pipe(gulp.dest('./build'));
})

gulp.task('bowersify', function() {
  browserify([source_paths.js], {
          transform: ['babelify']
      })
      .bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest('./build/js/'));
})

gulp.task('build', ['sass','bowersify','copy'])

gulp.task('build:watch', ['build'], function() {
  gulp.watch(source_paths.sass, ['sass'])
  gulp.watch(source_paths.all_js, ['bowersify'])
  gulp.watch(source_paths.html, ['copy'])
});

gulp.task('serve', ['build:watch'],function() {
  gulp.src('build')
    .pipe(webserver({open: true, livereload: true}));
});

gulp.task('default', ['build']);
