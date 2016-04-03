import * as browserSync from 'browser-sync';
import * as del from 'del';
import * as gulp from 'gulp';
import * as runSequence from 'run-sequence';
import {DIR_TMP, DIR_DST, DIR_SRC, typescriptTask} from './common.ts';

gulp.task('clean', del.bind(null, [DIR_TMP, DIR_DST]));

gulp.task('ts', () => typescriptTask());

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
  gulp.watch(`${DIR_SRC}/**/*.{css,html}`, null).on('change', browserSync.reload);
});

gulp.task('default', done => runSequence('clean', 'ts', 'serve', done));
