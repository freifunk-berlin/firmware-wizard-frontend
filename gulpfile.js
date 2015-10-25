var gulp = require('gulp');
var minimist = require('minimist');
var rename = require('gulp-rename');
var debug = require('gulp-debug');

var buildDir = './dist/';

var knownOptions = {
    string: 'env',
      default: { env: process.env.NODE_ENV || 'prod' }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('build:copy', function() {
  gulp.src('src/index.*').pipe(gulp.dest(buildDir));
  gulp.src('src/nls/locale-*.json').pipe(gulp.dest(buildDir + '/nls/'));
  gulp.src('src/view/**').pipe(gulp.dest(buildDir + '/view/'));
  console.log('build for >'+options.env+'< environment');
  gulp.src('src/env/constants_'+options.env+'.js').pipe(debug()).pipe(rename('constants.js')).pipe(gulp.dest('src/js/config'));
});

gulp.task('build:vendor', function() {
  gulp.src([
    'bower_components/angular/angular.min.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/angular-translate/angular-translate.min.js',
    'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    'bower_components/angular-leaflet-directive/dist/' +
      'angular-leaflet-directive.min.js',
    'bower_components/angular-simple-logger/dist/angular-simple-logger.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
  ]).pipe(gulp.dest(buildDir + 'vendor/angular'));

  gulp.src([
    'bower_components/bootstrap/dist/css/bootstrap.min.css'
  ])
    .pipe(gulp.dest(buildDir + 'vendor/bootstrap/css'));

  gulp.src([
    'bower_components/font-awesome/css/font-awesome.min.css',
    'bower_components/font-awesome/fonts/*.woff'
  ], {base: 'bower_components/font-awesome'})
    .pipe(gulp.dest(buildDir + 'vendor/font-awesome'));

  gulp.src([
    'bower_components/leaflet/dist/leaflet.css',
    'bower_components/leaflet/dist/leaflet.js',
    //'bower_components/leaflet/dist/images/marker-icon.png',
    //'bower_components/leaflet/dist/images/marker-shadow.png',
  ], {base: 'bower_components/leaflet/dist'})
    .pipe(gulp.dest(buildDir + 'vendor/leaflet'));
});
