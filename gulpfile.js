const gulp = require ('gulp');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();
const useref = require('gulp-useref');
const cssnano = require('cssnano');
const imagemin = require('gulp-imagemin');
const gulpIf = require('gulp-if');
const autoprefixer = require('autoprefixer');
const postcss = require('gulp-postcss');
const del = require('del');
const runSequence = require('run-sequence');

gulp.task ('sass', function() {
    return gulp.src('app/scss/*.scss')   
    .pipe(sass())
    .pipe(gulp.dest('app/css')); 
});

gulp.task('serve-dist', function() {
    browserSync.init({
        server: {
            baseDir: 'dist'
        }
    });
});

gulp.task('serve-dev', function() {
    browserSync.init({
        server: {
            baseDir: 'app'
        }
    });
});

gulp.task('css', function() {
    var plugins = [
        autoprefixer(),
        cssnano()
    ];
    return gulp.src('app/index.html')
    .pipe(useref())
    .pipe(gulpIf('*.css', postcss(plugins)))
    .pipe(gulp.dest('dist'));
});

gulp.task('images', function() {
    return gulp.src('app/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('dist/img'));
});

gulp.task('fonts', function() {
    return gulp.src('app/fonts/*')
    .pipe(gulp.dest('dist/fonts'));
});

gulp.task('clean', function() {
    return del.sync('dist');
});

gulp.task('deploy', function() {
    runSequence('clean', 'sass', ['css', 'images', 'fonts'], 'serve-dist');

    gulp.watch('app/scss/*.scss', ['sass']);
    gulp.watch('app/**/*.+(html|css)', ['css'], browserSync.reload);
    gulp.watch('app/img/*', ['images'], browserSync.reload);
    gulp.watch('app/fonts/*', ['fonts'], browserSync.reload);
});

gulp.task ('dev', function() {
    runSequence('sass', 'serve-dev');

    gulp.watch('app/scss/*.scss', ['sass']);
    gulp.watch('app/**/*.+(html|css)', browserSync.reload);
    gulp.watch('app/img/*', browserSync.reload);
    gulp.watch('app/fonts/*', browserSync.reload);
});