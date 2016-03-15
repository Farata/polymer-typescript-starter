import * as del from 'del';
import * as glob from 'glob';
import * as gulp from 'gulp';
import * as gulpLoadPlugins from 'gulp-load-plugins';
import * as path from 'path';
import * as runSequence from 'run-sequence';
import {DIR_TMP, DIR_DST, DIR_SRC, DIR_WCS, typescript} from './common.ts';

const $ = <any>gulpLoadPlugins();

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
function getShards() {
  return glob.sync(`${DIR_SRC}/pages/*/*.html`)
      .map(p => path.relative('src', p))
      .concat('index.html');
}

gulp.task('clean', del.bind(null, [DIR_TMP, DIR_DST]));

gulp.task('ts', () => typescript(DIR_TMP));

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
