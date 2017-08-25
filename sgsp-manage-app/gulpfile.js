'use strict';

var gulp = require("gulp");
var webpack = require("webpack-stream");
var path = require("path");
var sync = require("run-sequence");
//var serve = require("browser-sync");
var rename = require("gulp-rename");
var template = require("gulp-template");
var fs = require("fs");
var yargs = require("yargs");
var lodash = require("lodash");
var rimraf = require("gulp-rimraf");
var connect = require("gulp-connect");

let reload = function() { connect.reload() };
let root = 'client';
let dist = 'www';

// helper method for resolving paths
let resolveToApp = function(glob) {
  glob = glob || '';
  return path.join(root, 'app', glob); // app/{glob}
};

let resolveToComponents = function(glob) {
  glob = glob || '';
  return path.join(root, 'app/components', glob); // app/components/{glob}
};

// map of all paths
let paths = {
  js: resolveToApp('**/*!(.spec.js).js'), // exclude spec files
  css: resolveToApp('**/*.css'), // stylesheets
  image: [resolveToApp('**/*.png'), resolveToApp('**/*.jpg'), resolveToApp('**/*.gif')], // image
  html: [
    resolveToApp('**/*.html'),
    path.join(root, 'index.html')
  ],
  index: path.join(root, 'index.html'),
  index_production: path.join(root, 'index_production.html'),
  entry: path.join(root, 'app/app.js'),
  output: dist,
  blankTemplates: path.join(__dirname, 'generator', 'component/**/*.**')
};

gulp.task('clean', function() {
  return gulp.src(paths.output, { read: false })
    .pipe(rimraf({ force: true }))
    .pipe(gulp.src(paths.index));
});

gulp.task('copy', function()  {
  if(process.env.NODE_ENV === 'production') {
    return gulp.src(paths.index_production)
      .pipe(rename("index.html"))
      .pipe(gulp.dest(paths.output))
  }
  else {
    return gulp.src(paths.index)
      .pipe(gulp.dest(paths.output));
  }
});

// use webpack.config.js to build modules
gulp.task('webpack', function()  {
  return gulp.src(paths.entry)
    .pipe(webpack(require('./webpack.config')))
    .pipe(gulp.dest(paths.output));
});

/*gulp.task('serve', function ()  {
  serve({
    port: process.env.PORT || 3000,
    open: false,
    server: { baseDir: dist }
  });
});*/

gulp.task('connect', () => {
  connect.server({
    root: [dist],
    port: process.env.PORT || 3000,
    base : 'http://localhost',
    livereload: true
  });
});


gulp.task('watch', function()  {
  let allPaths = [].concat([paths.js], paths.html, [paths.css]);
  gulp.watch(allPaths, ['webpack', reload]);
});

gulp.task('component', function()  {

  let cap = (val) => {
    return val.charAt(0).toUpperCase() + val.slice(1);
  }
  let cap2 = (val) => {
    return cap(camel(val));
  };
  let camel = (val) => {
    return val.replace (/[\s|_|-](.)/g, ($1) => $1.toUpperCase()).replace (/[\s|_|-]/g, '').replace (/^(.)/, ($1) => $1.toLowerCase());
  };
  let name = yargs.argv.name;
  let parentPath = yargs.argv.parent || '';
  let destPath = path.join(resolveToComponents(), parentPath, name);

  return gulp.src(paths.blankTemplates)
    .pipe(template({
      name: name,
      upCaseName: cap2(name),
      camelName : camel(name)
    }))
    .pipe(rename((path) => {
      path.basename = path.basename.replace('temp', name);
    }))
    .pipe(gulp.dest(destPath));
});

gulp.task('init', function(done) {
  sync('clean', 'copy', done);
});

gulp.task('build', function(done) {
  sync('init', 'webpack', done);
});

gulp.task('run', function(done)  {
  sync('webpack', 'connect', 'watch', done);
});
