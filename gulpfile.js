var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concatCss = require('gulp-concat-css');
var iife = require("gulp-iife");
var useref = require('gulp-useref');
var gulpif = require('gulp-if');
var autoprefixer = require('gulp-autoprefixer');
var cssnano = require('gulp-cssnano');
var sass = require('gulp-sass');
var del = require('del');
var babel = require("gulp-babel");
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var es = require('event-stream');
var eslint = require('gulp-eslint');

gulp.task("build", function () {

    del.sync(['dist']);

    gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'));

    gulp.src('src/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', babel({
            presets: ['env']
        })))
        .pipe(gulpif('*.js', iife({
            useStrict: false,
            prependSemicolon: false
        })))
        .pipe(gulp.dest('dist'));


    gulp.src('src/img/*')
        .pipe(gulp.dest('dist/img'));

    gulp.src('src/*.mp4')
        .pipe(gulp.dest('dist'));
     gulp.src('src/captions.txt')
        .pipe(gulp.dest('dist'));
    
    gulp.src('src/font/*')
        .pipe(gulp.dest('dist/font'));
    
    //    gulp.src('src/robots.txt')
    //        .pipe(gulp.dest('dist'));

});



gulp.task('doit', function () {
    gulp.src('dist/*.css')
        .pipe(autoprefixer({
            browsers: ['last 90 versions'],
            cascade: false
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist'));

    gulp.src('dist/*.js')
     .pipe(gulpif('*.js', babel({
            presets: ['env']
        })))
        .pipe(uglify())
        .pipe(gulp.dest('dist'));
    
    gulp.src('dist/img/*')
        .pipe(cache(imagemin()))
        .pipe(gulp.dest('dist/img'));
})

gulp.task('iife', function () {
    gulp.src('dist/*.js')
        .pipe(iife({
                useStrict: false,
                prependSemicolon: false
            }))
    .pipe(uglify())
              .pipe(gulp.dest('dist'));
        });

gulp.task('watch', function () {
    gulp.watch('src/*.html', ['html']);
    gulp.watch('src/scss/*.scss', ['scss']);
    gulp.watch('src/js/*.js', ['babel']);
})

gulp.task("html", function () {
    gulp.src('src/index.html')
        .pipe(useref())
        .pipe(gulp.dest('dist'));
});

gulp.task("babel", function () {
    gulp.src('src/index.html')
        .pipe(useref())
        .pipe(gulpif('*.js', babel({
            presets: ['env']
        })))
        .pipe(gulp.dest('dist'));
});

gulp.task("scss", function () {
    gulp.src('src/scss/*.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('dist'));

});

gulp.task('eslint', function () {

    return gulp.src(['src/js/*.js','!node_modules/**'])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});
 