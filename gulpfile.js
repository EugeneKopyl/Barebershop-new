var gulp = require("gulp");
var server = require("browser-sync").create();
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");
var minify = require("gulp-csso");
var rename = require("gulp-rename");
var svgstore = require("gulp-svgstore");

//images

// var imagemin = require("gulp-imagemin");
// var webp = require("gulp-webp");

gulp.task("serve", ["style"], function() {
	server.init({
		server: "source/"
	});
	gulp.watch("source/less/**/*.less", ["style"]);
	gulp.watch("source/*.html")
		.on("change", server.reload);
});

gulp.task("style", function () {
	gulp.src("source/less/style.less")
		.pipe(plumber())
		.pipe(less())
		.pipe(postcss([
			autoprefixer()
		]))
		.pipe(gulp.dest("source/css"))
		.pipe(minify())
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest("source/css"))
		.pipe(server.stream())
});


//images

// gulp.task("image", function () {
// 	return gulp.src("source/img/**/*.{png,jpg,svg}")
// 		.pipe(imagemin([
// 			imagemin.optipng({optimization: 3}),
// 			imagemin.jpegtran({progressive: true}),
// 			imagemin.svgo()
// 		]))
// 		.pipe(gulp.dest("source/img"));
// });

// gulp.task("webp", function () {
// 	return gulp.src("source/img/**/*.{png,jpg}")
// 		.pipe(webp({quality:90}))
// 		.pipe(gulp.dest("source/img"));
// });


// svgstore

gulp.task("sprite", function () {
	return gulp.src("source/img/icon-*.svg")
		.pipe(svgstore({
			inlineSvg: true
		}))
		.pipe(rename("sprite.svg"))
		.pipe(gulp.dest("source/img"));
});
