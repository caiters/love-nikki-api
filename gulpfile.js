var gulp = require("gulp"),
  sass = require("gulp-sass"),
  autoprefixer = require("gulp-autoprefixer"),
  sourcemaps = require("gulp-sourcemaps"),
  concat = require("gulp-concat"),
  plumber = require("gulp-plumber"),
  connect = require("gulp-connect");

var paths = {
  cssSrc: "src/scss/nikki.scss",
  cssParts: "src/scss/*/**",
  cssDest: "public/css/",
  jsDest: "public/scripts/",
  js: "src/js/*",
  jsParts: "src/js/*/**",
  jsVendor: "src/js/vendor/*"
};

gulp.task("connect", function() {
  connect.server({
    root: "./",
    livereload: true
  });
});

gulp.task("css", function() {
  gulp
    .src(paths.cssSrc)
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(sourcemaps.write())
    .pipe(plumber.stop())
    .pipe(gulp.dest(paths.cssDest))
    .pipe(connect.reload());
});

gulp.task("scripts", function() {
  gulp
    .src([paths.jsVendor, paths.jsParts, paths.js])
    .pipe(concat("all.js"))
    .pipe(gulp.dest(paths.jsDest))
    .pipe(connect.reload());
});

gulp.task("watch:css", ["css"], function() {
  gulp.watch([paths.cssSrc, paths.cssParts], ["css"]);
});

gulp.task("watch:scripts", ["scripts"], function() {
  gulp.watch([paths.js, paths.jsParts, paths.jsVendor], ["scripts"]);
});

gulp.task("default", ["css", "scripts", "watch:css", "watch:scripts"]);

gulp.task("build", ["css", "scripts"]);
