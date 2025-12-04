const { src, dest, watch, series, parallel } = require('gulp');
const concat = require('gulp-concat');
const cssnano = require('gulp-cssnano');
const sass = require('gulp-sass')(require('sass'));
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const { deleteAsync } = require('del');

const paths = {
  styles: {
    src: 'src/scss/**/*.scss',
    dest: 'dist/css',
  },
  scripts: {
    src: 'src/js/**/*.js',
    dest: 'dist/js',
  },
  images: {
    src: 'src/images/**/*',
    dest: 'dist/images',
  },
};

function clean() {
  return deleteAsync(['dist']);
}

function styles() {
  return src(paths.styles.src)
    .pipe(sass().on('error', sass.logError))
    .pipe(concat('main.css'))
    .pipe(dest(paths.styles.dest))
    .pipe(rename({ suffix: '.min' }))
    .pipe(cssnano())
    .pipe(dest(paths.styles.dest));
}

function scripts() {
  return src(paths.scripts.src)
    .pipe(concat('main.js'))
    .pipe(dest(paths.scripts.dest))
    .pipe(rename({ suffix: '.min' }))
    .pipe(uglify())
    .pipe(dest(paths.scripts.dest));
}

async function images() {
  const { default: imagemin, gifsicle, mozjpeg, optipng, svgo } = await import('gulp-imagemin');

  return src(paths.images.src)
    .pipe(
      imagemin([
        gifsicle({ interlaced: true }),
        mozjpeg({ quality: 80, progressive: true }),
        optipng({ optimizationLevel: 5 }),
        svgo({ plugins: [{ removeViewBox: false }] }),
      ])
    )
    .pipe(dest(paths.images.dest));
}

function watcher() {
  watch(paths.styles.src, styles);
  watch(paths.scripts.src, scripts);
  watch(paths.images.src, images);
}

const build = series(clean, parallel(styles, scripts, images));

exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.images = images;
exports.watch = watcher;
exports.build = build;
exports.default = series(build, watcher);
