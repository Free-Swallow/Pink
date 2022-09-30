import gulp from 'gulp';
import plumber from 'gulp-plumber';
import sass from 'gulp-dart-sass';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import {create as bsCreate} from 'browser-sync';
import {deleteSync} from "del";
import htmlMin from 'gulp-htmlmin';
import sourcemap from 'gulp-sourcemaps';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import imagemin from 'gulp-imagemin';
import webp from 'gulp-webp';
import svgstore from 'gulp-svgstore';
import gulpAvif from 'gulp-avif';
const browser = bsCreate();

// HTML

export const htmlMinify = () => {
  return gulp.src("source/*.html")
    .pipe(htmlMin({ collapseWhitespace: true }))
    .pipe(gulp.dest("build"));
}

// Styles

export const styles = () => {
  return gulp.src('source/sass/style.scss', { sourcemaps: true })
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename("style.min.css"))
    .pipe(gulp.dest("build/css", { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Scripts

export const scripts = () => {
  return gulp.src("source/js/main.js", { sourcemaps: true })
    .pipe(terser())
    .pipe(rename("main.min.js"))
    .pipe(gulp.dest("build/js", { sourcemaps: '.' }))
    .pipe(browser.stream());
}

// Copy

export const copy = (done) => {
  gulp.src([
    "source/fonts/*.{woff2,woff}",
    "source/favicon/*.{png,ico,webmanifest,svg}",
    // "source/images/**/*.svg",
    "source/js/picturefill.min.js",
    "source/leaflet/**/*",
    "!source/images/icon/*.svg",
  ], {
    base: "source"
  })
    .pipe(gulp.dest("build"))
  done();
}

// Sprite

export const sprite = () => {
  return gulp.src("source/images/icon/*.svg")
    .pipe(svgstore({
      inlineSvg: true
    }))
    .pipe(rename("sprite.svg"))
    .pipe(gulp.dest("build/images"))
}

// Images

export const imagesOptimize = () => {
  return gulp.src("source/images/**/*.{jpg,png,svg}")
    .pipe(imagemin([
      imagemin.mozjpeg({progressive: true}),
      imagemin.optipng({optimizationLevel: 7}),
      imagemin.svgo()
    ]))
    .pipe(gulp.dest("build/images"))
}

export const copyImages = () => {
  return gulp.src("source/imagesDev/**/*.{png,jpg,svg,webp,avif}")
    .pipe(gulp.dest("build/images"))
}

// Webp

export const createWebp = () => {
  return gulp.src("source/images/**/*.{png,jpg}")
    .pipe(webp({quality: 90}))
    .pipe(gulp.dest("build/images"))
}

// Avif

export const createAvif = () => {
  return gulp.src("source/images/**/*.{png,jpg}")
    .pipe(gulpAvif({quality: 90}))
    .pipe(gulp.dest("build/images"))
}

// Server

export const server = (done) => {
  browser.init({
    server: {
      baseDir: "build"
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Clean

const clean = async () => {
  return deleteSync("build");
}

// Reload

const reload = (done) => {
  browser.reload();
  done();
}

// Watcher

const watcher = () => {
  gulp.watch("source/sass/**/*.scss", gulp.series(styles, reload));
  gulp.watch("source/js/main.js", gulp.series(scripts, reload));
  gulp.watch("source/*.html", gulp.series(htmlMinify, reload));
}

// Build

export const build = gulp.series(
  clean,
  copy,
  imagesOptimize,
  gulp.parallel(
    styles,
    htmlMinify,
    scripts,
    sprite,
    createWebp,
    createAvif
  ),
);

// Default

export default gulp.series(
  clean,
  copy,
  // imagesOptimize,
  copyImages,
  gulp.parallel(
    styles,
    htmlMinify,
    scripts,
    sprite,
    // createWebp,
    // createAvif
  ),
  gulp.series(
    server,
    watcher
  ));
