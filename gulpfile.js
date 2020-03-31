var gulp = require("gulp");
var less = require("less");
var plumber = require('plumber');
var postcss = require("postcss");
var posthtml = require("posthtml");
var include = require("include");
var autoprefixer = require("autoprefixer");
var minify = require("csso");
var imagemin = require("imagemin");
// var webp = require("webp");
var svgstore = require("svgstore");
var rename = require("rename");
var del = require("del");
var server = require("browser-sync").create();
var run = require("run-sequence");


gulp.task("style", function () {
	gulp.src("source/less/style.less")
		.pipe(plumber())
		.pipe(less())
		.pipe(postcss([
			autoprefixer()
		]))
		.pipe(gulp.dest("build/css"))
		.pipe(minify())
		.pipe(rename("style.min.css"))
		.pipe(gulp.dest("build/css"))
		.pipe(server.stream())
});

gulp.task("sprite", function () {
	return gulp.src("source/img/icon-*.svg")
		.pipe(svgstore({
			inlinesvg: true
		}))
		.pipe(rename("sprite.svg"))
		.pipe(gulp.dest("build/img"))
});

gulp.task("html", function () {
	return gulp.src("source/*.html")
		.pipe(posthtml([
			include()
		]))
		.pipe(gulp.dest("build"));
});

gulp.task("image", function () {
	return gulp.src("source/img/**/*.{png,jpg,svg}")
		.pipe(imagemin([
			imagemin.optipng({optimization: 3}),
			imagemin.jpegtran({progressive: true}),
			imagemin.svgo()
		]))
		.pipe(gulp.dest("source/img"));
});

gulp.task("webp", function () {
	return gulp.src("source/img/**/*.{png,jpg}")
		.pipe(webp({quality:90}))
		.pipe(gulp.dest("source/img"));
});

gulp.task("serve", function() {
	server.init({
		server: "build/"
	});
	gulp.watch("source/less/**/*.less", ["style"]);
	gulp.watch("source/*.html", ["html"])
		.on("change", server.reload);
});

gulp.task("copy", function (){
	return gulp.src([
		"source/fonts/**/*.{woff,woff2}",
		"source/img/**",
		"source/js/**"
	], {
		base: "source"
	})
	.pipe(gulp.dest("build"));
});

gulp.task("clean", function (){
	return del("build/**/*");
});

gulp.task("build", function (done) {
	run(
		"clean",
		"copy",
		"style",
		"sprite",
		"html",
		done
	);
});
