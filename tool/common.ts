import * as gulp from 'gulp';
import * as gulpTypescript from 'gulp-typescript';
import * as path from 'path';

export const DIR_TMP = '.tmp';
export const DIR_DST = 'dist';
export const DIR_SRC = 'src';

/**
 * The `project` is used inside the "ts" task to compile TypeScript code using
 * tsconfig.json file. The project MUST be created outside of the task to
 * enable incremental compilation.
 */
const project = gulpTypescript.createProject('tsconfig.json', {
  /**
   * We don't use any kind of modules or <reference> tags in our project, so we
   * don't need to support external modules resolving. According to the
   * gulp-typescript plugin docs explicitly disabling it can improve
   * compilation time.
   */
  noExternalResolve: true
});

export function typescript(dest: string) {
  return gulp.src([`${DIR_SRC}/**/*.ts`, 'typings/browser/**/*.d.ts'], {base: DIR_SRC})
      .pipe(gulpTypescript(project))
      .pipe(gulp.dest(dest));
}
