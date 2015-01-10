'use strict';
var gulp = require('gulp')
  , gutil = require('gulp-util')
  , jade = require('gulp-jade')
  , rm = require('gulp-rm')
  , iconFont = require('gulp-iconfont')
  , consolidate = require('gulp-consolidate')
  , fs = require('fs')
  , del = require('del')
  , buildbranch = require('buildbranch')
  , express = require('express')
  , expressPort = 8080
  , app = express()
  , livereload = require('gulp-livereload')
  , liveReloadPort = 35729
  , tinylr = require('tiny-lr')
  , server = tinylr()
  , srcPath = 'src/'
  , distPath = 'dist/'
;

gulp.task('clean', function() {
  return del.sync(
    [
      distPath + '*'
    ]
  );
});

gulp.task('mkdir', function() {
  try {
    fs.mkdirSync(distPath);
  } catch (e) {
  }
  try {
    fs.mkdirSync(distPath + 'fonts/');
  } catch (e) {
  }
  try {
    fs.mkdirSync(distPath + 'css/');
  } catch (e) {
  }
  try {
    fs.mkdirSync(distPath + 'images/');
  } catch (e) {
  }

  return gulp
    .src([srcPath + 'images/*'])
    .pipe(gulp.dest(distPath + 'images/'))
  ;
});

gulp.task('build-fonts', ['build-fonts-ttf', 'build-fonts-woff']);

gulp.task('build-fonts-ttf', ['mkdir'], function() {
  return gulp.src([srcPath + 'fonts/*.ttf'])
    .pipe(gulp.dest(distPath + 'fonts/'))
    .pipe(require('gulp-ttf2eot')())
    .pipe(gulp.dest(distPath + 'fonts/'))
  ;
});

gulp.task('build-fonts-woff', ['mkdir'], function() {
  return gulp.src([srcPath + 'fonts/*.ttf'])
    .pipe(require('gulp-ttf2woff')())
    .pipe(gulp.dest(distPath + 'fonts/'))
    .pipe(gulp.dest('dist'))
  ;
});

gulp.task('build-fonts-icons', ['mkdir'], function() {
  gulp.src([srcPath + 'icons/*.svg'])
    /*
    .pipe(iconFontCss({
      fontName: 'myicons'
      , base: '../fonts/'
      , targetPath: '../../' + srcPath + 'less/icons.less'
      , fontPath: srcPath + 'fonts/'
    }))
    */
    .pipe(iconFont({
      fontName: 'myicons'
      , normalize: true
    }))
    .on('codepoints', function(codepoints, options) {
      gulp.src(srcPath + 'templates/icons.less')
        .pipe(consolidate('lodash', {
          glyphs: codepoints
          , fontName: 'myicons'
          , fontPath: '../fonts/'
          , className: 'icon'
        }))
        .pipe(gulp.dest(srcPath + 'less/'))
      ;
    })
    .pipe(gulp.dest(srcPath + 'fonts/'))
  ;
});

gulp.task('build-css', ['mkdir'], function() {
  return gulp.src(srcPath + 'less/*.less')
    .pipe(require('gulp-streamify')(require('gulp-less')))
    .on('error', function(error) {
      gutil.log(error);
      this.emit('end');
    })
    .pipe(gulp.dest(distPath + 'css/'))
    .pipe(livereload(server))
  ;
});

gulp.task('build-html', ['mkdir'], function() {
  return gulp.src(srcPath + 'index.jade')
    .pipe(jade({pretty: true}))
    .on('error', function(error) {
      gutil.log(error);
      this.emit('end');
    })
    .pipe(gulp.dest(distPath))
    .pipe(livereload(server))
  ;
});

gulp.task('server', ['build-html', 'build-css', 'build-fonts'], function() {
  app.use(express.query())
    .use(require('connect-livereload')({
      port: liveReloadPort
    }))
    .use(express.static(__dirname + '/' + distPath))
    .listen(expressPort, function() {
      gutil.log('HTTP Server listening on port ' + expressPort);
    })
  ;
});

gulp.task('watch', ['server'], function() {
  server.listen(liveReloadPort, function(error) {
    if (error) {
      gutil.log(error);
    }
    gutil.log('LR Server listening on port ' + liveReloadPort);
    require('open')('http://localhost:' + expressPort + '/');
  });
  gulp.watch(srcPath + '*.jade', ['build-html']);
  gulp.watch(srcPath + 'less/*.less', ['build-css']);
  gulp.watch(srcPath + 'fonts/*.ttf', ['build-fonts']);
});

gulp.task('ghpages', function() {
  return buildbranch({
    ignore: [',git']
    , branch: 'gh-pages'
    , folder: 'dist'
    , domain: 'sebastien.elet.fr'
  }
  , function(err) {
    if (err) {
      gutil.log(err);
    }
    gutil.log('Gh-pages updated');
  });
});

gulp.task('build', ['build-html', 'build-fonts', 'build-css']);

gulp.task('publish', ['ghpages']);

gulp.task('default', ['clean', 'mkdir', 'build', 'server', 'watch']);
