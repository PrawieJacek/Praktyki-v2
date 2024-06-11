const gulp = require('gulp'),
      sass = require('gulp-sass')(require('sass')),
      sourcemaps = require('gulp-sourcemaps'),
      rename = require('gulp-rename'),
      minify = require('gulp-minify'),
      concat = require('gulp-concat'),
      browserSync = require('browser-sync').create();
      

gulp.task('sass', function () {
  return gulp.src('./assets/scss/*.scss')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass({outputStyle: 'expanded'}))
    .pipe(sourcemaps.write('./assets/css'))
    .pipe(gulp.dest('sass'))
});


gulp.task('npsass', function () {
  return gulp.src('./assets/scss/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./assets/css'));
})

gulp.task('sassMin', function () {
  return gulp.src('./assets/scss/**/*.scss')
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(sass({outputStyle: 'compressed'}))    
    .pipe(rename({ suffix: '.min' }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./assets/css')) 
    .pipe(browserSync.reload({
      stream: true
    }))
});

gulp.task('jsmin', function() { 
  return gulp.src(['assets/js/*.js'])
    .pipe(concat('all.js'))
    .pipe(minify({
      ext:{
          src:'.js',
          min:'.min.js'
      }
    }))
    .pipe(gulp.dest('assets/dist/js'));
});

gulp.task('browserSync', function(done) {
  browserSync.init({
    server: {
      baseDir: './'
    },
  });
  done();
});

gulp.task('watch', gulp.series('browserSync', 'sass', 'sassMin', 'jsmin', function () {

    gulp.watch('./assets/scss/**/*.scss', gulp.series('sass', 'sassMin'));
    gulp.watch('./assets/js/**/*.js', gulp.series('jsmin'), browserSync.reload(browserSync.reload({
      stream: true
    })));
    gulp.watch("*.html", { events: 'all' }, function(cb) {
      browserSync.reload(browserSync.reload({
        stream: true
      }));
      cb();
    });
   
}));             