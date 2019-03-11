const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const htmlmin = require('gulp-htmlmin');


//Если делать с препроцессорами то не надо создавать массив с последовательностью файлов. С ними пишешь 1 файл main.css и в него уже импортируем в нужном порядке другие css файлы @footer и так далее
const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './src/css/main.css'
];

const jsFiles = [
    './src/js/main.js'
];


function styles(){
    return gulp.src(cssFiles)
               // .pipe()
               .pipe(concat('all.css'))
               .pipe(autoprefixer({
                    browsers: ['> 0.1%'],
                    cascade: false
                }))
                .pipe(cleanCSS({
                    level: 2
                }))
               .pipe(gulp.dest('./build/css'))
               .pipe(browserSync.stream());
}

function scripts(){
    return gulp.src(jsFiles)
               .pipe(concat('all.js'))
               .pipe(uglify({
                   toplevel: true
               }))
               .pipe(gulp.dest('./build/js'))
               .pipe(browserSync.stream());
}

function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        },
        notify: false,
        tunnel: true
    });
    gulp.watch('./src/css/**/*.css', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html').on('change', browserSync.reload);
}

function clean(){
   return del(['build/*'])
}

gulp.task('styles', styles);
gulp.task('script', scripts);
gulp.task('watch', watch);

//Надо последовательно выполнить команды Clean и параллельно styles и scripts
//Без кавычек, потому-что Clean не зарегистрирован как task, она просто как функция
gulp.task('build', gulp.series(clean, 
                   gulp.parallel(styles, scripts)
                ));

//build в кавычках потому что не создана функция, в переменной не сохранена
gulp.task('dev', gulp.series('build', 'watch'));