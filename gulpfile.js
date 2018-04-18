const gulp = require('gulp');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const sass = require('gulp-sass');
const cleancss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');
const rename = require('gulp-rename');
const del = require('del');
const browserify = require('browserify');
const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
// const es = require('event-stream');

const output = './src/main/resources/static/dest/';

const path = {
    scripts: {
        src: './resource/js/*.js',
        dest: './src/main/resources/static/dest/js'
    },
    styles: {
        src: './resource/scss/*.scss',
        dest: './src/main/resources/static/dest/css'
    }
};

function clean() {
    return del(['./src/main/resources/static/dest/']);
}

function scripts() {
    return gulp.src(path.scripts.src, { sourcemaps: true })
        .pipe(babel({
            presets: ['env']
        }))
        .pipe(uglify())
        .pipe(gulp.dest(path.scripts.dest));
    // return browserify(path.scripts.src)
    //     .bundle()
    //     .pipe(babel())
    //     .pipe(source('main.js'))
    //     .pipe(buffer())
    //     .pipe(uglify())
    //     .pipe(gulp.dest(path.scripts.dest));
    // let tasks = path.scripts.src.map(function(entry) {
    //     return browserify({ entries: [entry] })
    //         .bundle()
    //         .pipe(source(entry))
    //         .pipe(rename({
    //             extname: '.bundle.js'
    //         }))
    //         .pipe(gulp.dest(path.scripts.dest));
    // });
    // return es.merge.apply(null, tasks);
}

function styles() {
    return gulp.src(path.styles.src, { sourcemaps: true })
        .pipe(sass())
        .pipe(cleancss({ compatibility: 'ie7' }))
        .pipe(autoprefixer({
            browsers: ['last 2 versions']
        }))
        .pipe(gulp.dest(path.styles.dest));
}

function watch() {
    gulp.watch(path.scripts.src, scripts);
    gulp.watch(path.styles.src, styles);
}

exports.clean = clean;
exports.scripts = scripts;
exports.styles = styles;
exports.watch = watch;

const build = gulp.series(clean, gulp.parallel(scripts), gulp.parallel(styles));

gulp.task('build', build);
gulp.task('default', build);