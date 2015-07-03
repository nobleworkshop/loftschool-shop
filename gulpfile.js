"use strict";

var gulp = require("gulp"),
	del = require("del"),
	sass = require("gulp-sass"),
	jade = require('gulp-jade'),
	uglify = require('gulp-uglify'),
	minifyCss = require('gulp-minify-css'),
	imagemin = require('gulp-imagemin'),
	autoprefixer = require('gulp-autoprefixer'),
	spritesmith = require('gulp.spritesmith'),
	ftp = require('vinyl-ftp'),
	gulpif = require('gulp-if'),
	wiredep = require('wiredep').stream,
	browserSync = require('browser-sync'),
	useref = require('gulp-useref'),
	args = require('yargs').argv,
	reload = browserSync.reload;

gulp.task('default', ['server', 'watch']);

// Запуск сервера
gulp.task('server', ['jade', 'sass'], function () {
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: 'app'
		}
	});	
});


//Слежка
gulp.task('watch', function () {
	gulp.watch('app/jade/**/*.jade', ['jade']);
	gulp.watch('app/sass/**/*.scss', ['sass']);
	gulp.watch('bower.json', ['wiredep']);
	gulp.watch([
		'app/js/**/*.js'
	]).on('change', reload);
});

// Компилируем JADE
gulp.task('jade', function() {
	gulp.src('app/jade/*.jade')
		.pipe(jade({
			pretty: '	'
		}))
		.pipe(gulp.dest('./app/'))
		.pipe(reload({stream: true}));
});

// Компилируем SCSS
gulp.task('sass', function () {
	gulp.src('./app/sass/*.scss')
		.pipe(sass.sync().on('error', sass.logError))
		.pipe(autoprefixer({
			browsers: ['> 1% in RU']
		}))
		.pipe(gulp.dest('./app/css/'))
		.pipe(reload({stream: true}));
});

// Подключаем ссылки на bower components
gulp.task('wiredep', function () {
	gulp.src('app/jade/*.jade')
		.pipe(wiredep({
			ignorePath: /^(\.\.\/)*\.\./
		}))
		.pipe(gulp.dest('app/jade/'));
});

gulp.task('sprite', function () {
	// Generate our spritesheet 
	var spriteData = gulp.src('./app/sprite/*.png')
	.pipe(spritesmith({
		imgName: 'sprite.png',
		cssName: '_sprite.scss',
		imgPath: '../img/sprite.png',
		padding: 50
	}));
 
	// Pipe image stream through image optimizer and onto disk 
	spriteData.img.pipe(gulp.dest('./app/img/'));
 
	// Pipe CSS stream through CSS optimizer and onto disk 
	spriteData.css.pipe(gulp.dest('./app/sass/'));
});


// ====================================================
// ================= Сборка DIST ======================

// Очистка папки
gulp.task('clean', function () {
	return del('dist');
});

// Переносим HTML, CSS, JS в папку dist 
gulp.task('useref', function () {
	var assets = useref.assets();
	return gulp.src('app/*.html')
		.pipe(assets)
		.pipe(gulpif('*.js', uglify()))
		.pipe(gulpif('*.css', minifyCss({compatibility: 'ie8'})))
		.pipe(assets.restore())
		.pipe(useref())
		.pipe(gulp.dest('./dist'));
});

// Перенос шрифтов
gulp.task('fonts', function() {
	gulp.src('app/font/**/*')
		.pipe(gulp.dest('dist/font'))
});

// Картинки
gulp.task('images', function () {
	return gulp.src('app/img/**/*')
		.pipe(imagemin({
			progressive: true,
			interlaced: true
		}))
		.pipe(gulp.dest('dist/img'));
});

// Остальные файлы, такие как favicon.ico и пр.
gulp.task('extras', function () {
	return gulp.src([
		'app/*.*',
		'!app/*.html'
	]).pipe(gulp.dest('dist'));
});

// Сборка и вывод размера содержимого папки dist
gulp.task('dist', ['useref', 'images', 'fonts', 'extras'], function () {
	return gulp.src('dist/**/*');
});

// Собираем папку DIST (только после компиляции Jade)
gulp.task('build', ['clean', 'jade'], function () {
	gulp.start('dist');
});

// Проверка сборки 
gulp.task('server-dist', function () {	
	browserSync({
		notify: false,
		port: 9000,
		server: {
			baseDir: 'dist'
		}
	});
});

// ====================================================
// ===== Отправка проекта на сервер ===================

gulp.task( 'deploy', function() {

	var conn = ftp.create( {
			host:	'karo-dev.ru',
			user:'webmaster',
			password: args.password,
			parallel: 10
	} );

	var globs = [
			'dist/**/*'
	];

	return gulp.src(globs, { base: 'dist/', buffer: false })
		.pipe(conn.dest( 'karo-dev/shop/'));

});