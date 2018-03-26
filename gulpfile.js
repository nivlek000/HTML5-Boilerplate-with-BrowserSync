const gulp = require('gulp');
const changed = require('gulp-changed');
const plumber = require('gulp-plumber'); //handles error 
const imagemin = require('gulp-imagemin'); //image minifier
const uglify = require('gulp-uglify'); //js minifier
const babel = require('gulp-babel'); //transpiles from to acceptible js
const sass = require('gulp-sass'); //scss to css transpiler
const cssmin = require('gulp-cssmin'); //css minifier
const rename = require('gulp-rename'); //renamer
const htmlmin = require('gulp-htmlmin'); //html minifier
const browserSync = require('browser-sync').create();

const htmlminoptions = {
    collapseWhitespace: true,
    removeComments: true
};

const babeloptions = {
    presets: ['env']
};
//had to install gulp-cli globally


/* GULP top level functions

gulp.task - define tasks
gulp.src - source
gulp.dest - destination
gulp.watch - watches files and folders for changes

*/

//logs message
gulp.task('message', () => {
    console.log('Gulp is Running');
});

//all together
gulp.task('default', ['message', 'minhtml', 'minimage', 'sass_mincss', 'babel_minjs', 'serve'], () => {
    console.log("Default Complete!");
});


//min and copy all .html in src to dist
gulp.task('minhtml', () => {
    gulp.src('./src/**/*.html')
        .pipe(changed('dist'))
        .pipe(plumber())
        .pipe(htmlmin(htmlminoptions))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist'))
        .pipe(browserSync.stream());
});

//imagemin optimizer
gulp.task('minimage', () => {
    gulp.src('src/img/**/*')
        .pipe(changed('dist'))
        .pipe(plumber())
        .pipe(imagemin())
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/img'))
        .pipe(browserSync.stream());
});

//babel
gulp.task('babel_minjs', () =>
    gulp.src('src/js/**/*.js*')
        .pipe(changed('dist'))
        .pipe(plumber())
        .pipe(babel(babeloptions))
        .pipe(uglify())
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/js'))
        .pipe(browserSync.stream())
);

//compile sass to CSS then Minify then rename then save
gulp.task('sass_mincss', () =>
    gulp.src('src/scss/**/*.scss')
        .pipe(changed('dist'))
        .pipe(plumber())
        .pipe(sass().on('error', sass.logError))
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(plumber.stop())
        .pipe(gulp.dest('dist/css'))
        .pipe(browserSync.stream())
);

//browsersync and gulpp watchers
gulp.task('serve', () => {
    browserSync.init({
        server: './dist',
        online: true
    });

    gulp.watch('src/js/**/*.js*', ['babel_minjs']);
    gulp.watch('src/scss/**/*.scss', ['sass_mincss']);
    gulp.watch('src/img/**/*', ['minimage']);
    gulp.watch('./src/**/*.html', ['minhtml']);
})
