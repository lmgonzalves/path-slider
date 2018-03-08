var gulp = require('gulp'),
    browserSync = require('browser-sync'),
    sass = require('gulp-sass'),
    prefix = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename');

gulp.task('serve', ['sass', 'dist'], function() {
    browserSync.init({
        server: {
            baseDir: "./"
        },
        open: false,
        online: false,
        notify: false
    });

    gulp.watch('scss/*.scss', ['sass']);
    gulp.watch('js/path-slider.js', ['dist']);
    gulp.watch(['*.html', 'js/*']).on('change', browserSync.reload);
});

gulp.task('sass', function () {
    return gulp.src('scss/*.scss')
        .pipe(sass({outputStyle: 'expanded'}))
        .pipe(prefix(['last 5 versions'], {cascade: true}))
        .pipe(gulp.dest('css'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('dist', function(){
    return gulp.src('js/path-slider.js')
        .pipe(gulp.dest('dist'))
        .pipe(uglify({preserveComments: 'some'}))
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.reload({stream:true}));
});

gulp.task('default', ['serve']);
