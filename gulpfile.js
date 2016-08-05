var gulp = require('gulp');

var buildDir = './dist/';

gulp.task('build:locales', function() {
  gulp.src('src/nls/locale-*.json').pipe(gulp.dest(buildDir + '/nls/'));
});

gulp.task('build:assets', function () {
  gulp.src(['src/assets/**/*']).pipe(gulp.dest(buildDir + 'assets/'));
  gulp.src(['src/shared/**/*']).pipe(gulp.dest(buildDir + 'shared/'));
});

gulp.task('build:vendor', function() {
  gulp.src([
    'bower_components/angular/angular.min.js',
    'bower_components/angular-animate/angular-animate.min.js',
    'bower_components/angular-messages/angular-messages.min.js',
    'bower_components/angular-sanitize/angular-sanitize.min.js',
    'bower_components/angular-translate/angular-translate.min.js',
    'bower_components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
    'bower_components/angular-leaflet-directive/dist/' +
      'angular-leaflet-directive.min.js',
    'bower_components/angular-bootstrap/ui-bootstrap-tpls.min.js',
    'node_modules/ng-file-upload/dist/ng-file-upload.min.js',
  ]).pipe(gulp.dest(buildDir + 'vendor/angular'));

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
