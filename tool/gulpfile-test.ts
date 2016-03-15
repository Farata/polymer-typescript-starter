import * as del from 'del';
import * as gulp from 'gulp';
import * as runSequence from 'run-sequence';
import {DIR_TMP, DIR_DST, copyHtmlTask, typescriptTask} from './common.ts';

gulp.task('clean', del.bind(null, [DIR_TMP, DIR_DST]));

gulp.task('ts', () => typescriptTask());

gulp.task('copy.html', () => copyHtmlTask());

gulp.task('default', done => runSequence('clean', ['ts', 'copy.html'], done));
