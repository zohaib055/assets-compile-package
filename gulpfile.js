// Include Gulp plugins
var gulp = require('gulp');

var sass = require('gulp-sass');  

var minifyCSS = require('gulp-minify-css');  

var minifyHTML = require('gulp-minify-html'); // Minify HTML  

var concat = require('gulp-concat'); // Join all JS files together to save space  

var stripDebug = require('gulp-strip-debug'); // Remove debugging stuffs  

var uglify = require('gulp-uglify');     // Minify JavaScript  

var imagemin = require('gulp-imagemin'); // Minify images  

var jshint = require('gulp-jshint');       // Debug JS files  

var stylish = require('jshint-stylish');   // More stylish debugging  

var browserSync = require('browser-sync'); // Reload the browser on file changes  


// Task to compile Sass file into CSS, and minify CSS into build directory

gulp.task('styles', function() {  
  gulp.src('./app/sass/styles.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./app/css'))
    .pipe(minifyCSS())
    .pipe(gulp.dest('./build/styles/'))
    .pipe(browserSync.reload({
          
          stream: true,
     }));
});

gulp.task('html', function() {  
  return gulp.src('./app/*.html')
    .pipe(minifyHTML())
    .pipe(gulp.dest('./build/'));
});

// Task to minify images into build
gulp.task('images', function() {  
  gulp.src('./app/images/*')
  .pipe(imagemin({
    progressive: true,
  }))
  .pipe(gulp.dest('./build/images'));
});

// Task to run JS hint (with some style)

gulp.task('jshint', function() {  
  gulp.src('./app/scripts/*.js')
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'));
});

// Task to concat, strip debugging and minify JS files

gulp.task('scripts', function() {  
  gulp.src(['./app/scripts/lib.js', './app/scripts/*.js'])
    .pipe(concat('script.js'))
    .pipe(stripDebug())
    .pipe(uglify())
    .pipe(gulp.dest('./build/scripts/'));
});

// Serve application

gulp.task('serve', ['styles', 'html', 'scripts', 'images', 'jshint'], function() {  
  browserSync.init({
    server: {
      baseDir: 'app',
    },
  });
});


// Run all Gulp tasks and serve application

gulp.task('default', ['serve', 'styles'], function() {  
  gulp.watch('app/sass/**/*.scss', ['styles']);
  gulp.watch('app/*.html', browserSync.reload);
  gulp.watch('app/scripts/**/*.js', browserSync.reload);
});