declare module "web-component-tester" {
  import gulp = require('gulp');

  interface GulpRunner {
    init(gulp: gulp.Gulp, dependencies?: any[])
  }

  interface Runner {
    cli: any;
    config: any;
    gulp: GulpRunner;
    steps: any;
    test: any;
  }

  var tmp: Runner;
  export = tmp;
}
