'use strict';

const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const loadPlugins = require('gulp-load-plugins');
const runSequence = require('run-sequence');

const $ = loadPlugins();

const DIR_TMP = '.tmp';
const DIR_DST = 'dist';
const DIR_SRC = 'src';

/**
 * The `project` is used inside the "ts" task to compile TypeScript code using
 * tsconfig.json file. The project MUST be created outside of the task to
 * enable incremental compilation.
 */
const project = $.typescript.createProject('tsconfig.json', {
  /**
   * We don't use any kind of modules or <reference> tags in our project, so we
   * don't need to support external modules resolving. According to the
   * gulp-typescript plugin docs explicitly disabling it can improve
   * compilation time.
   */
  noExternalResolve: true
});

const typescriptTask = (src, baseDir, dest) => {
  return gulp.src(src, {base: baseDir})
    .pipe($.typescript(project))
    .pipe(gulp.dest(dest));
};

// TODO: read source files from tsconfig.json
gulp.task('ts', () => {
  return typescriptTask([
      `${DIR_SRC}/**/*.ts`,
      'typings/browser/**/*.d.ts'],
    DIR_SRC, DIR_TMP);
});

gulp.task('clean', del.bind(null, [DIR_TMP, DIR_DST]));

// Used by Browsersync to reload browsers after ts task is complete.
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

gulp.task('default', done => {
  runSequence('clean', 'ts', 'serve', done);
});
