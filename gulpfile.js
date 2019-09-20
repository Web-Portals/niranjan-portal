var gulp = require('gulp');
var sass = require('gulp-sass');
var babel = require('gulp-babel');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var cleanCSS = require('gulp-clean-css');
var del = require('del');
var imagemin = require('gulp-imagemin');

var paths = {
  styles: {
    src: 'dev/sass/**/*.sass',
    dest: 'dist/sass/'
  },
  scripts: {
    src: 'dev/js/**/*.js',
    dest: 'dist/js/'
  },
  images: {
    src: 'dev/images/**/*.{jpg,jpeg,png}',
    dest: 'dist/images/'
  }
};

/* Not all tasks need to use streams, a gulpfile is just another node program
 * and you can use all packages available on npm, but it must return either a
 * Promise, a Stream or take a callback and call it
 */
function clean() {
  // You can use multiple globbing patterns as you would with `gulp.src`,
  // for example if you are using del 2.0 or above, return its promise
  return del(['dist']);
}

/*
 * Define our tasks using plain functions
 */
function styles() {
  return gulp.src(paths.styles.src)
    .pipe(sass())
    .pipe(cleanCSS())
    // pass in options to the stream
    .pipe(rename({
      basename: 'main',
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.styles.dest));
}

function scripts() {
  return gulp.src(paths.scripts.src, { sourcemaps: true })
    .pipe(babel())
    .pipe(uglify())
    .pipe(concat('main.min.js'))
    .pipe(gulp.dest(paths.scripts.dest));
}

// Copy all static images
function images() {
  return gulp.src(paths.images.src, { since: gulp.lastRun(images) })
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest(paths.images.dest));
}

function watch() {
  gulp.watch(paths.scripts.src, scripts);
  gulp.watch(paths.styles.src, styles);
}

/*
 * Specify if tasks run in series or parallel using `gulp.series` and `gulp.parallel`
 */
var build = gulp.series(clean, gulp.parallel(images, scripts, styles));

/*
 * You can use CommonJS `exports` module notation to declare tasks
 */
exports.clean = clean;
exports.styles = styles;
exports.scripts = scripts;
exports.watch = watch;
exports.images = images;
exports.build = build;
/*
 * Define default task that can be called by just running `gulp` from cli
 */
exports.default = build;








/*
require('require-dir')('./gulp_tasks', { recurse: true });

gulp.task('clean', function (cb) {
  // You can use multiple globbing patterns as you would with `gulp.src`
  del(['build'], cb);
});

var scripts = function () {
  // Minify and copy all JavaScript (except vendor scripts)
  return gulp.src(paths.scripts)
    .pipe(coffee())
    .pipe(uglify())
    .pipe(concat('all.min.js'))
    .pipe(gulp.dest('build/js'));
};
gulp.task('scripts', ['clean'], scripts);
gulp.task('scripts-watch', scripts);

// Copy all static images
var images = function () {
  return gulp.src(paths.images)
    // Pass in options to the task
    .pipe(imagemin({ optimizationLevel: 5 }))
    .pipe(gulp.dest('build/imges'));
};
gulp.task('images', ['clean'], images);
gulp.task('images-watch', images);

// the task when a file changes
gulp.task('watch', function () {
  gulp.watch(paths.scripts, ['scripts-watch']);
  gulp.watch(paths.images, ['images-watch']);
});

// The default task (called when you run `gulp` from cli)
gulp.task('default', ['watch', 'scripts', 'images']);
*/
