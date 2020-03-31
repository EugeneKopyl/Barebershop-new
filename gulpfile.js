var gulp = require("gulp");
var server = require("browser-sync").create();
var less = require("gulp-less");
var plumber = require("gulp-plumber");
var postcss = require("gulp-postcss");
var autoprefixer = require("autoprefixer");

dulp.task("style", function () {
	gulp.src("source/less/style.less")
		.pipe(plumber())
		.pipe(less())
		.pipe(postcss([
			autoprefixer()
		]))
		.pipe(gulp.dest("source/css"))
		.pipe(server.stream());
});

gulp.task("serve", ["style"], function() {
	server.init({
		server: "source/"
	});
	gulp.watch("source/less/**/*.less", ["style"]);
	gulp.watch("source/*.html")
		.on("change", server.reload);
});
