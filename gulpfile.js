// TODO: Use browsify instead of gulp-useref. Do Scss to css conversion for prod build
var gulp = require("gulp");
var source = require("vinyl-source-stream");
var react = require("gulp-react");
var gulpif = require("gulp-if");
var uglify = require("gulp-uglify");
var streamify = require("gulp-streamify");
var notify = require("gulp-notify");
var useref = require("gulp-useref");
var concat = require("gulp-concat");
var cssmin = require("gulp-cssmin");
var glob = require("glob");
var livereload = require("gulp-livereload");
var connect = require("gulp-connect");
var sass = require("gulp-sass");
var htmlreplace = require("gulp-html-replace");
var sourcemaps = require("gulp-sourcemaps");

function jsxTransform(options) {
  function run() {
    gulp.src(options.src)
      .pipe(react())
      .on("error", function(err) {
        console.error("JSX ERROR in " + err.fileName);
        console.error(err.message);
        this.end();
      })
      .pipe(sourcemaps.init())
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log("JSX tranformation completed....");
      }));
  }
  run();
  if (options.development) { gulp.watch(options.src, run); }
}

function jsBuild(options) {
  function run() {
    gulp.src(options.src)
      .pipe(gulp.dest(options.dest))
      .pipe(connect.reload())
      .pipe(notify(function () {
        console.log("Js build completed....");
      }));
    }
    run();
    gulp.watch(options.src, run);
}

function styleBuild(options) {
  function run() {
    gulp.src(options.src)
      .pipe(sass().on("error", sass.logError))
      .pipe(gulp.dest(options.dest))
      .pipe(connect.reload())
      .pipe(notify(function () {
        console.log("Style build completed....");
      }));
  }
  run();
  gulp.watch(options.src, run);
}

function buildIndexHtml(options) {
  function run() {
    gulp.src(options.src)
      .pipe(gulp.dest(options.dest))
      .pipe(connect.reload())
      .pipe(notify(function () {
        console.log("Index html build completed....");
      }));
  }
  run();
  gulp.watch(options.src, run);
}


function copyAssets(options) {
  function run() {
    gulp.src(options.src)
      .pipe(gulp.dest(options.dest))
      .pipe(notify(function () {
        console.log("Copying asset completed....");
      }));
  }
  run();
  if (options.development) { gulp.watch(options.src, run); }
}

function prodBuild(options) {
  var assets = useref.assets();
  gulp.src('build/index.html')
    .pipe(assets)
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', cssmin()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist/'));
}

// For development
gulp.task("default", function () {

  jsxTransform({
    development: true,
    src: "./app/components/*.js",
    dest: "./build/components"
  })

  jsBuild({
    src: ["./app/js/*.js"],
    dest: "./build/js"
  });

  styleBuild({
    src: ["./app/styles/*.scss", "./app/styles/**/*.css"],
    dest: "./build/styles"
  });

  buildIndexHtml({
    src: "./app/index.html",
    dest: "./build/"
  });

  copyAssets({
    development: true,
    src: "./app/img/*.*",
    dest: "./build/img"
  });

  connect.server({
    root: "build/",
    port: 8000,
    livereload: true
  });
});

// production task
gulp.task("deploy", function () {
   copyAssets({
      development: false,
      src: "./app/img/*.*",
      dest: "./dist/img"
    });

   jsxTransform({
    development: false,
    src: "./app/components/*.js",
    dest: "./build/components"
  })
  prodBuild();
});
