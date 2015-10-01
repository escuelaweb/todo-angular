var gulp = require('gulp'),
    browserify = require("browserify"),
    source = require('vinyl-source-stream'),
    babelify = require("babelify"),
    webserver = require('gulp-webserver'),
    htmlmin = require('gulp-htmlmin'),
    uglify = require('gulp-uglify'),
    minifyCss = require('gulp-minify-css'),
    uuid = require('node-uuid'),
    ngAnnotate = require('gulp-ng-annotate'),
    rename = require("gulp-rename"),
    sass = require('gulp-sass');

var source_paths = {
  sass: './source/sass/**/*.scss',
  js: './source/js/app.js',
  all_js: './source/js/**/*.js',
  html: './source/html/**/*.html',
  dev_css: './build/css',
  dev_js: './build/js',
  dev_html: './build/',
  prod_css: './dist/css',
  prod_js: './dist/js',
  prod_html: './dist'
}

gulp.task('sass', function() {
  gulp.src(source_paths.sass)
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(gulp.dest(source_paths.dev_css));
})

gulp.task('copy', function() {
  gulp.src(source_paths.html)
    .pipe(gulp.dest(source_paths.dev_html));
})

gulp.task('browserify', function() {
  browserify([source_paths.js], {
          transform: ['babelify']
      })
      .bundle()
      .pipe(source('app.js'))
      .pipe(gulp.dest(source_paths.dev_js));
})

gulp.task('build', ['sass','browserify','copy'])

gulp.task('build:watch', ['build'], function() {
  gulp.watch(source_paths.sass, ['sass'])
  gulp.watch(source_paths.all_js, ['browserify'])
  gulp.watch(source_paths.html, ['copy'])
});

gulp.task('serve', ['build:watch'],function() {
  gulp.src('build')
    .pipe(webserver({open: true, livereload: true}));
});

gulp.task('sass:prod', ['sass'], function() {
  gulp.src(source_paths.dev_css + '/app.css')
    .pipe(minifyCss({compatibility: 'ie8'}))
    //.pipe(rename('app-' + uuid.v1() + '.css'))
    .pipe(gulp.dest(source_paths.prod_css));
});

gulp.task('browserify:prod', ['browserify'], function() {
  gulp.src(source_paths.dev_js + '/app.js')
    .pipe(ngAnnotate())
    .pipe(uglify())
    //.pipe(rename('app-' + uuid.v1() + '.js'))
    .pipe(gulp.dest(source_paths.prod_js));
});

gulp.task('html:prod', ['copy'], function() {
  gulp.src(source_paths.dev_html + '/**/*.html')
    .pipe(htmlmin({collapseWhitespace: true, removeComments: true}))
    .pipe(gulp.dest(source_paths.prod_html));
})


gulp.task('dist', ['sass:prod','browserify:prod', 'html:prod']);

gulp.task('default', ['build']);
