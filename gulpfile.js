// Require all the things
const gulp = require("gulp");
const gutil = require("gulp-util");

const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const minify = require("gulp-cssnano");

const browserSync = require("browser-sync").create();
const childProcess = require("child_process");

// Set the path variables
const siteRoot = "_site";
const baseSrc = "_dev";
const baseDest = "assets";


const paths = {
	styles: {
		src: baseSrc + "/sass/*.scss",
		watch: baseSrc + "/sass/**/*.scss",
		dest: "css"
	},
	scripts: {
		src: baseSrc + "/js/*.js",
		watch: baseSrc + "/js/**/*.js",
		dest: baseDest + "js"
	},
	images: {
		src: baseSrc + "/img/*", // be more specific
		dest: baseDest + "img"
	}
};

gulp.task("styles", () => {
	return gulp.src(paths.styles.src)
		.pipe(sass())
		.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
		.pipe(minify())
		.pipe(gulp.dest(paths.styles.dest));
});

gulp.task("scripts", () => {
	return gulp.src(paths.scripts.src)

		.pipe(gulp.dest(paths.scripts.dest));
});

gulp.task("images", () => {
	return gulp.src(paths.scripts.src)

		.pipe(gulp.dest(paths.scripts.dest));
});

gulp.task("jekyll-build", ["styles", "scripts", "images"], (done) => {
	const jekyll = childProcess.spawn('bundle', [
		'exec', 'jekyll', 'build'
	], {stdio: 'inherit'}).on('close', done);
});

gulp.task("jekyll-watch", ["styles", "scripts", "images"], (done) => {
	const jekyll = childProcess.spawn('bundle', [
		'exec', 'jekyll', 'build',
		'--watch',
		//'--incremental',
		'--drafts'
	], {stdio: 'inherit'}).on('close', done);
});

gulp.task("serve", () => {
	browserSync.init({
		files: [siteRoot + '/**'],
		port: 4000,
		ui: {
		    port: 4001
		},
		server: {
			baseDir: siteRoot
		},
		notify: false,
		logFileChanges: false
	});

	gulp.watch(paths.styles.watch, ["styles"]);
	gulp.watch(paths.scripts.watch, ["scripts"]);
	gulp.watch(paths.images.dir, ["images"]);
});


gulp.task("develop", ["jekyll-watch", "serve"]);

gulp.task("deploy", ["jekyll-build"]);

gulp.task("default", ["develop"]);