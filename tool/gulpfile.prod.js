'use strict';

const gulp = require('gulp');
const del = require('del');
const loadPlugins = require('gulp-load-plugins');
const path = require('path');
const runSequence = require('run-sequence');

const $ = loadPlugins();

const htmlminOptions = {
  collapseWhitespace           : true,
  customAttrAssign             : [/\$=/],
  minifyCSS                    : true,
  minifyJS                     : true,
  removeComments               : true,
  removeCommentsFromCDATA      : true,
  removeScriptTypeAttributes   : true,
  removeStyleLinkTypeAttributes: true
};

const DIR_SRC = 'src';
const DIR_DST = 'dist';
const DIR_TMP = '.tmp';
const DIR_WCS = path.join(DIR_TMP, '.wcs');

const SHARDS = [
  'index.html',
  'pages/home/home.html',
  'pages/profile/profile.html'
];

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
  return typescriptTask([`${DIR_SRC}/**/*.ts`, 'typings/browser/**/*.d.ts'], DIR_SRC, DIR_TMP);
});

gulp.task('wcs', $.shell.task([
  `web-component-shards \
      -r ${DIR_TMP} \
      -w ${DIR_WCS} \
      -e ${SHARDS.join(' ')}`
]));

gulp.task('htmlmin', () => {
  return gulp.src(`${DIR_DST}/**/*.html`)
    .pipe($.htmlmin(htmlminOptions))
    .pipe(gulp.dest(DIR_DST));
});

// Compresses production ready version of the app.
gulp.task('gzip', () => {
  return gulp.src(`${DIR_DST}/**/*.{html,js,css,svg}`)
    .pipe($.gzip({
      gzipOptions: {level: 6},
      threshold: '5kb'
    }))
    .pipe(gulp.dest(DIR_DST));
});

gulp.task('clean', del.bind(null, [DIR_TMP, DIR_DST]));

gulp.task('copy', () => {
  return gulp.src('src/**/*.html', {base: 'src'})
    .pipe(gulp.dest(DIR_TMP));
});

gulp.task('default', done => {
  runSequence('clean', ['ts', 'copy'], 'wcs', 'htmlmin', 'gzip', done);
});
