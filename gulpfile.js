// Require all the things
const gulp = require("gulp");
const gutil = require("gulp-util");
const plumber = require("gulp-plumber");
const rename = require("gulp-rename");

const sass = require("gulp-sass");
const autoprefixer = require("gulp-autoprefixer");
const minify = require("gulp-cssnano");

const browserSync = require("browser-sync").create();

const browserify = require("browserify");
const watchify = require("watchify");
const babelify = require("babelify");

const uglify = require("gulp-uglify");
const streamify = require("gulp-streamify");

const source = require('vinyl-source-stream');
const childProcess = require("child_process");

// Set the path variables
const siteRoot = "_site";
const baseSrc = "_dev";
const baseDest = "assets";


const paths = {
	styles: {
		src: baseSrc + "/sass/*.scss",
		watch: baseSrc + "/sass/**/*.scss",
		dest: baseDest + "/css"
	},
	scripts: {
		src: baseSrc + "/js/main.js",
		dest: baseDest + "/js"
	},
	images: {
		src: baseSrc + "/img/*.{jpg,png}",
		dest: baseDest + "/img"
	}
};


const watcher = browserify({
	entries: [paths.scripts.src],
	cache: {},
	packageCache: {}
}).plugin(watchify);

watcher.on("update", () => {
	return bundle(watcher)
		.pipe(source("bundle.js"))
		.pipe(gulp.dest(paths.scripts.dest));
});



function bundle(b) {
	return b
		.transform(babelify, {presets: ["es2015"]})
		.bundle()
		.on("error", (err) => {
			return gutil.log(err);
		});
}


gulp.task("styles", () => {
	return gulp.src(paths.styles.src)
		.pipe(plumber())
		.pipe(sass.sync())
		.pipe(autoprefixer({
			browsers: ["last 2 versions"]
		}))
		.pipe(minify())
		.pipe(gulp.dest(paths.styles.dest));
});

/*
gulp.task("scripts-build", () => {
	return bundle(browserify(paths.scripts.src))
		.pipe(source("bundle.js"))
		.pipe(streamify(uglify()))
		.pipe(gulp.dest(paths.scripts.dest));
});

gulp.task("scripts-watch", () => {
	return bundle(watcher)
		.pipe(source("bundle.js"))
		.pipe(streamify(uglify()))
		.pipe(gulp.dest(paths.scripts.dest));
});
*/

gulp.task("images", () => {
	return gulp.src(paths.images.src)
		.pipe(plumber())
		.pipe(gulp.dest(paths.images.dest));
});

gulp.task("jekyll-build", ["styles", "images"], (done) => {
	const jekyll = childProcess.spawn('bundle', [
		'exec', 'jekyll', 'build'
	], {stdio: 'inherit'}).on('close', done);
});

gulp.task("jekyll-watch", ["styles", "images"], (done) => {
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
	gulp.watch(paths.images.dir, ["images"]);
});


gulp.task("develop", ["jekyll-watch", "serve"]);

gulp.task("deploy", ["jekyll-build"]);

gulp.task("default", ["develop"]);