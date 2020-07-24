import { series, watch, src, dest, task } from "gulp";
import minifyCSS from "gulp-minify-css";
import sourcemaps from "gulp-sourcemaps";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import concat from "gulp-concat";
import browserSync from "browser-sync";
import uglify from "gulp-uglify";

let sync = browserSync.create();
// define functions
function css() {
  return src("./src/styles/*css")
    .pipe(sourcemaps.init())
    .pipe(autoprefixer())
    .pipe(minifyCSS())
    .pipe(concat("all.min.css"))
    .pipe(sourcemaps.write())
    .pipe(dest("./build/css"))
    .pipe(sync.stream());
}

function scss() {
  return src("./src/styles/*scss")
    .pipe(sass())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({ browsers: ["last 15 versions"] }))
    .pipe(minifyCSS())
    .pipe(concat("all.min.scss"))
    .pipe(sourcemaps.write())
    .pipe(dest("./build/css"));
}

function js() {
  return src("./src/scripts/**/*js")
    .pipe(concat("scripts.min.js"))
    .pipe(
      uglify({
        toplevel: true,
      })
    )
    .pipe(dest("./build/js"))
    .pipe(sync.stream());
}


function watcher() {
  sync.init({
    server: {
      baseDir: "./",
    },
  });
  watch("./src/styles/**/*.css", css);
  watch("./src/scripts/**/*.js", js);
  watch("./src/html/**/*.html").on("change", sync.reload);
}

// Expose helloworld series task
exports.default = watcher;
