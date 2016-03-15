'use strict';

const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const path = require('path');
const runSequence = require('run-sequence');
const $ = require('gulp-load-plugins')();

const common = require('./common');
const DIR_TMP = common.DIR_TMP;
const DIR_DST = common.DIR_DST;
const DIR_SRC = common.DIR_SRC;

gulp.task('clean', del.bind(null, [DIR_TMP, DIR_DST]));

gulp.task('ts', () => common.typescript(DIR_TMP));

gulp.task('ts-watch', ['ts'], browserSync.reload);

gulp.task('serve', () => {
  browserSync.init({
    notify: false,
    server: {
      baseDir: [DIR_TMP, DIR_SRC],
      routes: {
        '/bower_components': 'bower_components',
        '/node_modules': 'node_modules'
      }
    }
  });

  gulp.watch(`${DIR_SRC}/**/*.ts`, ['ts-watch']);
  gulp.watch(`${DIR_SRC}/**/*.{css,html}`).on('change', browserSync.reload);
});

gulp.task('default', done => runSequence('clean', 'ts', 'serve', done));
