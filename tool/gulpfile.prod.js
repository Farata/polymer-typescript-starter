'use strict';

const gulp = require('gulp');
const glob = require('glob');
const del = require('del');
const path = require('path');
const runSequence = require('run-sequence');
const $ = require('gulp-load-plugins')();

const common = require('./common');
const DIR_TMP = common.DIR_TMP;
const DIR_DST = common.DIR_DST;
const DIR_SRC = common.DIR_SRC;
const DIR_WCS = common.DIR_WCS;

/**
 * Returns a list of paths to HTML modules relative to the src directory. Each
 * HTML file will become a bundle with all dependencies inlined. Common
 * dependencies will be moved to a separate bundle called shared.html.
 *
 * The convention - each HTML file that represents a page becomes a "shard" +
 * index.html.
 *
 * @returns {Array<string>}
 */
function getShards() => {
  return glob.sync(`${DIR_SRC}/pages/*/*.html`)
      .map(p => path.relative('src', p))
      .concat('index.html');
}

gulp.task('clean', del.bind(null, [DIR_TMP, DIR_DST]));

gulp.task('ts', () => common.typescript(DIR_TMP));

gulp.task('wcs', $.shell.task([
  `web-component-shards \
    -r ${DIR_TMP} \
    -w ${DIR_WCS} \
    -e ${getShards().join(' ')}`
]));

gulp.task('htmlmin', () => {
  return gulp.src(`${DIR_DST}/**/*.html`)
    .pipe($.htmlmin(htmlminOptions))
    .pipe(gulp.dest(DIR_DST));
});

// Compresses production ready version of the app.
gulp.task('gzip', () => {
  return gulp.src(`${DIR_DST}/**/*.{html,js,css,svg}`)
    .pipe($.gzip({gzipOptions: {level: 6}, threshold: '1kb'}))
    .pipe(gulp.dest(DIR_DST));
});

gulp.task('copy', () => {
  return gulp.src(`${DIR_SRC}/**/*.html`, {base: 'src'})
    .pipe(gulp.dest(DIR_TMP));
});

gulp.task('default', done => {
  runSequence('clean', ['ts', 'copy'], 'wcs', 'htmlmin', 'gzip', done);
});

var htmlminOptions = {
  collapseWhitespace           : true,
  customAttrAssign             : [/\$=/],
  minifyCSS                    : true,
  minifyJS                     : true,
  removeComments               : true,
  removeCommentsFromCDATA      : true,
  removeScriptTypeAttributes   : true,
  removeStyleLinkTypeAttributes: true
};
