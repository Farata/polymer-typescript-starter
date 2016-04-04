import * as del from 'del';
import * as glob from 'glob';
import * as gulp from 'gulp';
import * as gzip from 'gulp-gzip';
import * as htmlmin from 'gulp-htmlmin';
import * as path from 'path';
import * as runSequence from 'run-sequence';
import * as shell from 'gulp-shell';
import {
    DIR_TMP,
    DIR_DST,
    DIR_SRC,
    copyHtmlTask,
    typescriptTask
} from './common.ts';

gulp.task('clean', del.bind(null, [DIR_TMP, DIR_DST]));

gulp.task('ts', () => typescriptTask());

gulp.task('copy.html', () => copyHtmlTask());

gulp.task('wcs', shell.task([
  `web-component-shards \
    -r ${DIR_TMP} \
    -e ${getShards().join(' ')}`
]));

gulp.task('htmlmin', () => {
  return gulp.src(`${path.join(DIR_TMP, DIR_DST)}/**/*.html`)
    .pipe(htmlmin(htmlminOptions))
    .pipe(gulp.dest(DIR_DST));
});

gulp.task('gzip', () => {
  return gulp.src(`${DIR_DST}/**/*.{html,js,css,svg}`)
    .pipe(gzip({gzipOptions: {level: 6}, threshold: '1kb'}))
    .pipe(gulp.dest(DIR_DST));
});

gulp.task('default', done => {
  runSequence('clean', ['ts', 'copy.html'], 'wcs', 'htmlmin', 'gzip', done);
});

gulp.task('polylint', shell.task([
  `polylint \
    -r ${DIR_TMP} \
    -i ${getShards().join(' ')}`
]));

gulp.task('lint', done => {
  runSequence('clean', ['ts', 'copy.html'], 'polylint', done);
});

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

var htmlminOptions = {
  collapseWhitespace           : true,
  conservativeCollapse         : true,
  customAttrAssign             : [/\$=/],
  minifyCSS                    : true,
  minifyJS                     : true,
  removeComments               : true,
  removeCommentsFromCDATA      : true,
  removeScriptTypeAttributes   : true,
  removeStyleLinkTypeAttributes: true
};
