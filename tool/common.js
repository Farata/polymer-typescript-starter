const gulp = require('gulp');
const gulpTypescript = require('gulp-typescript');
const path = require('path');

const DIR_TMP = '.tmp';
const DIR_DST = 'dist';
const DIR_SRC = 'src';
const DIR_WCS = path.join(DIR_TMP, '.wcs');

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

const typescript = (dest) => {
  return project.src()
      .pipe(gulpTypescript(project))
      .pipe(gulp.dest(dest));
};

module.exports = {
  DIR_DST,
  DIR_SRC,
  DIR_TMP,
  DIR_WCS,
  typescript
};
