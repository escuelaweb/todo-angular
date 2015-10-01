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
    concat = require("gulp-concat"),
    ngHtml2Js = require("gulp-ng-html2js"),
    inject = require('gulp-inject'),
    es = require('event-stream'),
    sass = require('gulp-sass');

var source_paths = {
  sass: './source/sass/**/*.scss',
  js: './source/js/app.js',
  all_js: './source/js/**/*.js',
  html: './source/html/**/*.html',
  html_index: './source/html/index.html',
  partials: './source/html/views/**/*.html',
  partials_dest: './source/js/partials',
  dev_css: './build/css',
  dev_js: './build/js',
  dev_html: './build/',
  prod_css: './dist/css',
  prod_js: './dist/js',
  prod_html: './dist',
  prod_partials: './dist/views',
  inject_dev: ['./build/js/app.js', './build/css/app.css'],
  inject_prod: [],  
}

tasks = {
  baseBrowserify: function() {
   return browserify([source_paths.js], {
          transform: ['babelify']
      })
      .bundle()
      .pipe(source('app.js'))
  },
  prodBrowserify: function() {
    return this.baseBrowserify()
      .pipe(ngAnnotate())
      .pipe(uglify())
      .pipe(rename(tasks.assetProdName('js')))
      .pipe(gulp.dest(source_paths.prod_js))
  },
  devBrowserify: function() {
    return this.baseBrowserify()
      .pipe(gulp.dest(source_paths.dev_js));
  },
  prodCss: function() {
    return gulp.src(source_paths.sass)
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(minifyCss({compatibility: 'ie8'}))
      .pipe(rename(tasks.assetProdName('css')))
      .pipe(gulp.dest(source_paths.prod_css));
  },
  devCss: function() {
    return gulp.src(source_paths.sass)
      .pipe(sass.sync().on('error', sass.logError))
      .pipe(gulp.dest(source_paths.dev_css));
  },
  injectHtml: function(dest, injected_files) {
    return gulp.src(source_paths.html_index)
      .pipe(inject(injected_files, 
                  {
                    ignorePath: ['dist', 'build', 'source'],
                    removeTags: true,
                  }))
      .pipe(gulp.dest(dest))
  },
  BaseNgHtml: function(dest) {
    return gulp.src(source_paths.partials)
      .pipe(htmlmin({
        empty: true,
        spare: true,
        quotes: true
      }))
      .pipe(ngHtml2Js({
        moduleName: "PartialsPrecompile",
        prefix: "./views/"
      }))
      .pipe(concat("all.js"))
      .pipe(uglify())
      .pipe(gulp.dest(dest))
  },
  assetProdName: function(type) {
    var name = "app-" + uuid.v1() + "." + type; 
    source_paths.inject_prod.push("./dist/" + type + "/" + name)
    console.log(source_paths.inject_prod)
    return name
  },
}

gulp.task('ngHtml', function() {
  tasks.BaseNgHtml(source_paths.partials_dest)
})

gulp.task('inject', ['ngHtml'], function() {
  tasks.injectHtml(source_paths.dev_html, es.merge(tasks.devCss(), tasks.devBrowserify()))  
})

gulp.task('inject:prod',['ngHtml'], function() {
  tasks.injectHtml(source_paths.prod_html, es.merge(tasks.prodCss(), tasks.prodBrowserify()))
});

gulp.task('browserify', function() {
  tasks.devBrowserify()
})

gulp.task('build', ['inject'])

gulp.task('build:watch', ['build'], function() {
  gulp.watch(source_paths.sass, ['sass'])
  gulp.watch(source_paths.all_js, ['browserify'])
  gulp.watch(source_paths.html, ['inject'])
});

gulp.task('serve', ['build:watch'],function() {
  gulp.src('build')
    .pipe(webserver({open: true, livereload: true}));
});

gulp.task('dist', ['inject:prod']);

gulp.task('default', ['build']);
