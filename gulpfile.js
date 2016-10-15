var gulp          = require('gulp'),
    gulp_util     = require('gulp-util'),
    gulp_jade     = require('gulp-jade'),
    gulp_pug      = require('gulp-pug'),
    browser_sync  = require('browser-sync'),
    del           = require('del'),
    gulp_cache    = require('gulp-cache'),
    gulp_concat   = require('gulp-concat'),     //
    gulp_uglifyjs = require('gulp-uglifyjs'),
    gulp_coffee   = require('gulp-coffee'),
    gulp_sass     = require('gulp-sass'),       //
    gulp_cssnano  = require('gulp-cssnano'),
    gulp_rename   = require('gulp-rename'),
    gulp_autoprefixer = require('gulp-autoprefixer');

gulp.task('t-gulp-jade', function(){
  //task JADE
  return gulp.src(['app/include/jade/**/*.jade'])
    .pipe(gulp_jade())
    .pipe(gulp.dest('app/include/html/jade'));
});

gulp.task('t-gulp-pug', function(){
  //task JADE
  return gulp.src(['app/include/pug/**/*.pug'])
    .pipe(gulp_pug())
    .pipe(gulp.dest('app/include/html'));
});

gulp.task('t-gulp-sass', function(){
  //task sass
  return gulp.src(['app/include/sass/**/*.sass'])
    .pipe(gulp_sass())
    .pipe(gulp_autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true })) //CSS префиксы
    .pipe(gulp.dest('app/css'));
});

gulp.task('t-styles', ['t-gulp-sass'], function(){
  //task сжатия CSS файлов
  return gulp.src(['app/css/**/*.css','!app/css/**/*.min.css'])
  .pipe(gulp_cssnano())                //Сжатие файлов
  .pipe(gulp_rename({suffix: '.min'})) //Добавление суффикса .min
  .pipe(gulp.dest('app/css'));         //Результат выгрузить в директорию
});

gulp.task('t-gulp-coffee', function(){
  //task CoffeeScript
  return gulp.src(['app/include/coffee/**/*.coffee'])
    .pipe(gulp_coffee({bare: true}).on('error', gulp_util.log))
    .pipe(gulp.dest('app/include/scripts/coffee-build'));
});

gulp.task('t-scripts', ['t-gulp-coffee'], function(){
  //task собирания и сжатия JS файлов
  return gulp.src([
    //'app/libs/jquery/dist/jquery.min.js',
    'app/include/scripts/**/*.js'
  ])
  .pipe(gulp_concat('libs.min.js'))    //Собираем файлы в один
  .pipe(gulp_uglifyjs())               //Сжатие JS файла
  .pipe(gulp.dest('app/js'));           //Результат выгрузить в директорию
});

gulp.task('t-browser-sync', function(){
  //task browser-sync
  browser_sync({
    server: {
      baseDir: 'app' //Директория для сервера
    },
    notify: false //Отключение уведомлений
  });
});

gulp.task('t-watch', ['t-browser-sync', 't-styles', 't-scripts'], function(){
  //task watch - отслеживание через .reload (можно вынести в отдельную задачу) и по изменению файлов
  gulp.watch('app/include/jade/**/*.jade', ['t-gulp-jade']);
  gulp.watch('app/include/pug/**/*.pug', ['t-gulp-pug']);
  gulp.watch('app/include/sass/**/*.sass', ['t-styles']);
  gulp.watch('app/include/coffee/**/*.coffee', ['t-scripts']);
  gulp.watch('app/**/*.html', browser_sync.reload);
  gulp.watch('app/css/**/*.css', browser_sync.reload);
  gulp.watch('app/js/**/*.js', browser_sync.reload);
});

gulp.task('t-clear', function () {
  //очищение кеша
  return gulp_cache.clearAll();
});

gulp.task('t-clean', function(){
  //clean / del - build space
  return del.sync('dist');
});

gulp.task('t-build',['t-clean', 't-styles', 't-scripts'], function(){
  //task build project
  var buildHTML = gulp.src(['app/*.html'])
  .pipe(gulp.dest('dist'));

  var buildCSS = gulp.src(['app/css/**/*'])
  .pipe(gulp.dest('dist/css'));

  var buildJS = gulp.src(['app/js/**/*'])
  .pipe(gulp.dest('dist/js'));

  var buildFonts = gulp.src(['app/fonts/**/*'])
  .pipe(gulp.dest('dist/fonts'));

  var buildIMG = gulp.src('app/img/**/*')
  .pipe(gulp.dest('dist/img'));
});

gulp.task('default', ['t-watch']);

gulp.task('t-watch-coffee', function() {
  gulp_util.log('Gulp watch-coffee is running!');
  gulp.watch('app/include/coffee/**/*.coffee', ['t-scripts']);
});